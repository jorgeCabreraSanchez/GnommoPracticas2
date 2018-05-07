'use strict';

module.exports = function(AppUser) {
  const fs = require('fs');
  const HelperAppUser = require('../helpers/appUser-helper');

  const helperAppUser = new HelperAppUser(AppUser);

  AppUser.afterRemote('create', function(context, appUserInstance, next) {
    helperAppUser.sendVerifyEmail(appUserInstance, next); // and asign normal role
  });

    // AppUser.afterRemote('logout', function(context, appUserInstance, next) {
    //   // helperAppUser.deleteAccessToken(context, appUserInstance, next);
    //   next();
    // });

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
};

