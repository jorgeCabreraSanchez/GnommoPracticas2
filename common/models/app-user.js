'use strict';

module.exports = function(AppUser) {
  const fs = require('fs');
  const HelperAppUser = require('../helpers/appUser-helper');

  const helperAppUser = new HelperAppUser(AppUser);

  AppUser.validatesFormatOf('username', {with: /^[a-zA-Z0-9_.-]*$/, message: 'Must provide a valid username'});

  AppUser.afterRemote('create', function(context, appUserInstance, next) {
    helperAppUser.sendVerifyEmail(appUserInstance, next); // and asign normal role
  });

  AppUser.observe('after delete', function(ctx, next) {
    helperAppUser.deleteOnCascade(ctx, next); // Delete appUserBook when this appUser is in it
  });

  AppUser.on('resetPasswordRequest', function(appUserInstance) { // next?, maybe add?
    helperAppUser.sendEmailPasswordReset(appUserInstance);
  });

  AppUser.getRolesById = helperAppUser.getRolesById;

  AppUser.remoteMethod('getRolesById', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  AppUser.getAlertsByOwnerProvince = helperAppUser.getAlertsByOwnerProvince;

  AppUser.remoteMethod('getAlertsByOwnerProvince', {

    http: {verb: 'get'},

    http: {path: '/:id/get-alerts-by-owner-province'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  AppUser.assignAlert = helperAppUser.assignAlert;

  AppUser.remoteMethod('assignAlert', {

    http: {verb: 'post'},

    http: {path: '/:id/assign-alert/:alertId'},

    accepts: [{arg: 'id', type: 'string', http: {source: 'path'}},
              {arg: 'alertId', type: 'string', http: {source: 'path'}}],

    returns: {arg: 'response', type: 'object', root: true},

  });

  AppUser.generateNotificationForProvince = helperAppUser.generateNotificationForProvince;

  AppUser.remoteMethod('generateNotificationForProvince', {

    http: {verb: 'post'},

    http: {path: '/generate-notification-for-province/:province'},

    accepts: [
      {arg: 'province', type: 'string', http: {source: 'path'}},
      {arg: 'title', type: 'Object', http: {source: 'body'}},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });

  AppUser.assignRole = helperAppUser.assignRole;

  AppUser.remoteMethod('assignRole', {

    http: {verb: 'post'},

    http: {path: '/:id/assignRole/:role'},

    accepts: [
      {arg: 'id', type: 'string', http: {source: 'path'}},
      {arg: 'role', type: 'enum', values: ['admin', 'hospitalUser', 'technician'],
        http: {source: 'query'}},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });

  AppUser.getCreatedAlerts = helperAppUser.getCreatedAlerts;

  AppUser.remoteMethod('getCreatedAlerts', {

    http: {verb: 'post'},

    http: {path: '/:id/get-created-alerts'},

    accepts: [
      {arg: 'id', type: 'string', required: true, http: {source: 'path'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],

    returns: {arg: 'response', type: 'object', root: true},

  });
};

