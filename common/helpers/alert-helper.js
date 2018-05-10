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
          return next(new Error('You can\'t close an alert that is not finished'));
        }
        if (alertInstance.state == 'closed') {
          return next(new Error('You can\'t close an alert that is already closed'));
        }
        if (accessInstance.userId != alertInstance.owner) {
          return next(new Error('You can\'t close the alert of another technician'));
        }
        alertInstance.state = 'closed';
        alertInstance.note = note;
        alertInstance.save(next);
      });
    });
  };

  this.patchAttributes = (ctx, next) => {
    const AppUser = Alert.app.models.AppUser;
    const alertChanges = ctx.args.data;
    const alertBeforeChange = ctx.instance;

    // It has to exists in array provinces
    validateProvince(alertChanges);
    
    // If assigned is true, there must be owner
    // If assigned is false, there musn't be a owner
    checkAssignedOwner(alertChanges, alertBeforeChange, AppUser);

    // Can't change alert to state finished or closed if it don't have owner
    checkState(alertChanges, alertBeforeChange);

    // Creator can't be a technician
    checkCreator(alertChanges, AppUser);

    return next(null, true);
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
      return next(null, response);
      // alertInstance.save(next);
    })
    .catch(function(err) {
      console.log('Error sending message:', err);
      return next(err);
    });
  };
};

function validateProvince(alertChanges) {
  return new Promise((resolve, reject) => {
    if (alertChanges.province) {
      alertChanges.province = alertChanges.province.charAt(0).toUpperCase().concat(alertChanges.province.substring(1));
      if (!this.provinces.includes(alertChanges.province)) {
        reject(new Error('Province not exists'));
      }
    }
    resolve(true);
  });
}

function checkAssignedOwner(alertChanges, alertBeforeChange, AppUser) {  
  if (alertChanges.hasOwnProperty('assigned')) {
    if (alertChanges.assigned) {
      if (!alertChanges.owner && !alertBeforeChange.owner) {
        return next(new Error('If assigned is true, must have an owner'));
      }
      if (alertChanges.owner) {
        AppUser.getRolesById(alertChanges.owner.id, (err, role) => {
          if (err) return next(err);
          if (role != 'technician') {
            return next(new Error('Owner just can be a technician'));
          }
        });
      }
    } else {
      if (alertChanges.owner || alertBeforeChange.owner) {
        return next(new Error('Can\'t put assign false having a owner'));
      }
    }
  } else {
    if (alertChanges.owner) {
      return next(new Error('Can\'t assign owner without set assign true'));
    }
  }  
}

function checkState(alertChanges, alertBeforeChange) {
  if (alertChanges.state) {
    if (alertChanges.state == 'closed' || alertChanges.state == 'finished') {
      if ((!alertChanges.owner || !alertBeforeChange.owner)) {
        return next(new Error('You can\'t set state closed/finished without having owner'));
      }
    }
  }
}

function checkCreator(alertChanges, AppUser) {
  if (alertChanges.creator) {
    AppUser.getRolesById(alertChanges.creator, (err, role) => {
      if (err) next(err);
      if (role.name == 'technician') {
        return next(new Error('Creator can\'t be a technician'));
      }
    });
  }
}