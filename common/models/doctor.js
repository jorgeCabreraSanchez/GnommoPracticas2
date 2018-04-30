'use strict';

module.exports = function(Doctor) {
  const fs = require('fs');
  const HelperDoctor = require('../helpers/doctor-helper');

  const helperDoctor = new HelperDoctor(Doctor);

  Doctor.afterRemote('create', function(context, doctorInstance, next) {
    helperDoctor.sendVerifyEmail(doctorInstance, next); // and asign normal role
  });

  // Doctor.afterRemote('logout', function(context, doctorInstance, next) {
  //   // helperDoctor.deleteAccessToken(context, doctorInstance, next);
  //   next();
  // });

  Doctor.observe('after delete', function(ctx, next) {
    helperDoctor.deleteOnCascade(ctx, next); // Delete doctorBook when this doctor is in it
  });

  Doctor.on('resetPasswordRequest', function(doctorInstance) {
    helperDoctor.sendEmailPasswordReset(doctorInstance);
  });

  Doctor.getAlertsByProvince = helperDoctor.getAlertsByProvince;

  Doctor.remoteMethod('getAlertsByProvince', {

    http: {verb: 'get'},

    http: {path: '/get-alerts-by-province/:province'},

    accepts: {arg: 'province', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  Doctor.assignAlert = helperDoctor.assignAlert;

  Doctor.remoteMethod('assignAlert', {

    http: {verb: 'get'},

    http: {path: '/:id/assign-alert/:alertId'},

    accepts: [{arg: 'id', type: 'string', http: {source: 'path'}},
              {arg: 'alertId', type: 'string', http: {source: 'path'}}],

    returns: {arg: 'response', type: 'object', root: true},

  });

  // Doctor.subscribeAlerts = helperDoctor.subscribeAlerts;

  // Doctor.remoteMethod('subscribeAlerts', {

  //   http: {verb: 'get'},

  //   http: {path: '/:id/subscribe-alerts'},

  //   accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

  //   returns: {arg: 'response', type: 'object', root: true},

  // });

  // Doctor.unsubscribeAlerts = helperDoctor.unsubscribeAlerts;

  // Doctor.remoteMethod('unsubscribeAlerts', {

  //   http: {verb: 'get'},

  //   http: {path: '/:id/unsubscribe-alerts'},

  //   accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

  //   returns: {arg: 'response', type: 'object', root: true},

  // });
  
  Doctor.getRolesById = helperDoctor.getRolesById;

  Doctor.remoteMethod('getRolesById', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });
};
