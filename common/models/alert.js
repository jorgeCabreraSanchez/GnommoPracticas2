'use strict';

module.exports = function(Alert) {
  const fs = require('fs');
  const HelperAlert = require('../helpers/alert-helper');
  const helperAlert = new HelperAlert(Alert);

  Alert.beforeRemote('create', function(ctx, alertInstance, next) {    
    ctx.args.data.date = Date.now();
    ctx.args.data.state = 'unfinished';
    ctx.args.data.assigned = false;
    // ctx.args.data.save(next);
    next(null, ctx.args.data);
  });

  Alert.afterRemote('create', function(context, alertInstance, next) {
    // console.log(context);
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
