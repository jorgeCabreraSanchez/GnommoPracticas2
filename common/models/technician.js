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

  Technician.on('resetPasswordRequest', function(technicianInstance) { // next?, maybe add?
    helperTechnician.sendEmailPasswordReset(technicianInstance);
  });

  Technician.getRolesById = helperTechnician.getRolesById;

  Technician.remoteMethod('getRolesById', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  Technician.getAlertsByOwnerProvince = helperTechnician.getAlertsByOwnerProvince;

  Technician.remoteMethod('getAlertsByOwnerProvince', {

    http: {verb: 'get'},

    http: {path: '/:id/get-alerts-by-owner-province'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  Technician.assignAlert = helperTechnician.assignAlert;

  Technician.remoteMethod('assignAlert', {

    http: {verb: 'post'},

    http: {path: '/:id/assign-alert/:alertId'},

    accepts: [{arg: 'id', type: 'string', http: {source: 'path'}},
              {arg: 'alertId', type: 'string', http: {source: 'path'}}],

    returns: {arg: 'response', type: 'object', root: true},

  });

  Technician.generateNotificationForProvince = helperTechnician.generateNotificationForProvince;

  Technician.remoteMethod('generateNotificationForProvince', {

    http: {verb: 'post'},

    http: {path: '/generate-notification-for-province/:province'},

    accepts: [
      {arg: 'province', type: 'string', http: {source: 'path'}},
      {arg: 'title', type: 'Object', http: {source: 'body'}},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });
};

