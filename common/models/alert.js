'use strict';

module.exports = function(Alert) {
  const fs = require('fs');
  const HelperAlert = require('../helpers/alert-helper');
  const helperAlert = new HelperAlert(Alert);

  const provinces = ['Madrid', 'Barcelona'];

  Alert.beforeRemote('create', function(ctx, alertInstance, next) {
    ctx.args.data.date = Date.now();
    ctx.args.data.state = 'unfinished';
    ctx.args.data.assigned = false;
    ctx.args.data.province = ctx.args.data.province.charAt(0).toUpperCase().concat(ctx.args.data.province.substring(1));
    if (!provinces.includes(ctx.args.data.province)) next('Esa provincia no esta recogida');
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
      {arg: 'id', type: 'string', required: true, http: {source: 'path'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'note', type: 'string', required: true},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });
};
