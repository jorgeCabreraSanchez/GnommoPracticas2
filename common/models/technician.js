'use strict';

module.exports = function(Technician) {
  const fs = require('fs');
  const HelperTechnician = require('../helpers/technician-helper');

  const helperTechnician = new HelperTechnician(Technician);

  Technician.afterRemote('create', function(context, technicianInstance, next) {
    helperTechnician.sendVerifyEmail(technicianInstance, next); // and asign normal role
  });

    // Technician.afterRemote('logout', function(context, technicianInstance, next) {
    //   // helperTechnician.deleteAccessToken(context, technicianInstance, next);
    //   next();
    // });

  Technician.observe('after delete', function(ctx, next) {
    helperTechnician.deleteOnCascade(ctx, next); // Delete technicianBook when this technician is in it
  });

  Technician.on('resetPasswordRequest', function(technicianInstance) {
    helperTechnician.sendEmailPasswordReset(technicianInstance);
  });

  Technician.getAlertsByProvince = helperTechnician.getAlertsByProvince;

  Technician.remoteMethod('getAlertsByProvince', {

    http: {verb: 'get'},

    http: {path: '/get-alerts-by-province/:province'},

    accepts: {arg: 'province', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  Technician.assignAlert = helperTechnician.assignAlert;

  Technician.remoteMethod('assignAlert', {

    http: {verb: 'get'},

    http: {path: '/:id/assign-alert/:alertId'},

    accepts: [{arg: 'id', type: 'string', http: {source: 'path'}},
                {arg: 'alertId', type: 'string', http: {source: 'path'}}],

    returns: {arg: 'response', type: 'object', root: true},

  });

    // Technician.subscribeAlerts = helperTechnician.subscribeAlerts;

    // Technician.remoteMethod('subscribeAlerts', {

    //   http: {verb: 'get'},

    //   http: {path: '/:id/subscribe-alerts'},

    //   accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    //   returns: {arg: 'response', type: 'object', root: true},

    // });

    // Technician.unsubscribeAlerts = helperTechnician.unsubscribeAlerts;

    // Technician.remoteMethod('unsubscribeAlerts', {

    //   http: {verb: 'get'},

    //   http: {path: '/:id/unsubscribe-alerts'},

    //   accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    //   returns: {arg: 'response', type: 'object', root: true},

    // });
  Technician.getRolesById = helperTechnician.getRolesById;

  Technician.remoteMethod('getRolesById', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });
};

