'use strict';

module.exports = function(Alert) {
  const fs = require('fs');
  const HelperAlert = require('../helpers/alert-helper');
  const helperAlert = new HelperAlert(Alert);

  Alert.beforeRemote('create', function(ctx, alertInstance, next) {
    console.log(ctx.result);
    alertInstance.date = Date.now();
    alertInstance.state = 'unfinished';
    alertInstance.assigned = false;
    // ctx.result.save(next);
    next(null, alertInstance);
  });

  Alert.afterRemote('create', function(context, alertInstance, next) {
    helperAlert.sendNotification(alertInstance, next);
  });

  Alert.beforeRemote('*.patchAttributes', function(ctx, instance, next) {
    console.log(ctx);
    console.log(instance);
    console.log('Entra');
    next(null, true);
  });

  Alert.closeAlert = helperAlert.closeAlert;

  Alert.remoteMethod('closeAlert', {

    http: {verb: 'post'},

    http: {path: '/:id/close-alert'},

    accepts: [
      {arg: 'id', type: 'string', http: {source: 'path'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });
};
