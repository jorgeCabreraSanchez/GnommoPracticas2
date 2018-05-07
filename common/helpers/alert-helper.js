'use strict';

module.exports = function HelperAlert(Alert) {
  let admin = require('firebase-admin');
  const serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');

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
    console.log(ctx);
  };

  this.sendNotification = (alertInstance, next) => {
    const topic = `/topics/${alertInstance.province}`;

    var payload = {
      notification: {
        title: 'Se requiere de un médico',
        body: `${alertInstance.title}`,
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
