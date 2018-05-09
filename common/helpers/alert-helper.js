'use strict';

module.exports = function HelperAlert(Alert) {
  let admin = require('firebase-admin');
  const serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');
  const provinces = ['Barcelona', 'Madrid'];

  if (!firebaseApp) {
    var firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
    });
  }

  this.closeAlert = (id, req, note, next) => {
    const AccessToken = Alert.app.models.AccessToken;
    AccessToken.findById(req.query.access_token, function(err, accessInstance) {
      if (err) next(err);
      Alert.findById(id, function(err, alertInstance) {
        if (err) next(err);
        if (alertInstance.state == 'unfinished') {
          next(new Error('You can\'t close an alert that is not finished'));
        }
        if (alertInstance.state == 'closed') {
          next(new Error('You can\'t close an alert that is already closed'));
        }
        if (accessInstance.userId != alertInstance.owner) {
          next(new Error('You can\'t close the alert of another technician'));
        }
        alertInstance.state = 'closed';
        alertInstance.note = note;
        alertInstance.save(next);
      });
    });
  };

  this.patchAttributes = (ctx, next) => {
    const AppUser = Alert.app.models.AppUser;
    if (ctx.args.data.province) {
      ctx.args.data.province = ctx.args.data.province.charAt(0).toUpperCase().concat(ctx.args.data.province.substring(1));
      if (provinces.includes(ctx.args.data.province)) {
        next(new Error('Province not exists'));
      }
    }
    if (ctx.args.data.hasOwnProperty('assigned')) {
      if (ctx.args.data.assigned) {
        if (!ctx.args.data.owner && !ctx.instance.owner) {
          next(new Error('If assigned is true, must have an owner'));
        }
        if (ctx.args.data.owner) {
          AppUser.getRolesById(ctx.args.data.owner.id, (err, role) => {
            if (err) next(err);
            if (role != 'technician') {
              next(new Error('Owner just can be a technician'));
            }
          });
        }
      } else {
        if (ctx.args.data.owner || ctx.instance.owner) {
          next(new Error('Can\'t put assign false having a owner'));
        }
      }
    }

    if (ctx.args.data.state) {
      if (ctx.args.data.state == 'closed' || ctx.args.data.state == 'finished') {
        if ((!ctx.args.data.owner || !ctx.instance.owner) && ctx.instance.assigned) {
          next(new Error('You can\'t set state closed/finished without having owner and assigned true'));
        }
      }
    }
    if (ctx.args.data.creator) {
      AppUser.getRolesById(ctx.args.data.creator, (err, role) => {
        if (err) next(err);
        if (role == 'technician') {
          next(new Error('Creator can\'t be a technician'));
        }
      });
    }
    next(null, true);
  };

  this.sendNotification = (alertInstance, next) => {
    const topic = `/topics/${alertInstance.province}`;

    var payload = {
      notification: {
        title: `${alertInstance.title}`,
        body: `${alertInstance.description}`,
        color: 'blue',
        tag: `${alertInstance.title}`,
      },
      data: {
        priority: '10',
      },
    };

    var options = {
      priority: 'high',
      timeToLive: 1,
      collapseKey: `${alertInstance.title}`,
    };

    firebaseApp.messaging().sendToTopic(topic, payload, options)
    .then(function(response) {
      console.log('Successfully sent message:', response);
      next(null, response);
      // alertInstance.save(next);
    })
    .catch(function(err) {
      console.log('Error sending message:', err);
      next(err);
    });
  };
};

