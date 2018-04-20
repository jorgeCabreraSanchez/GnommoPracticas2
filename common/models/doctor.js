'use strict';

module.exports = function(Doctor) {
  const fs = require('fs');
  const HelperDoctor = require('../helpers/doctor-helper');

  const helperDoctor = new HelperDoctor(Doctor);

  Doctor.afterRemote('create', function(context, contactInstance, next) {
    helperDoctor.sendVerifyEmail(contactInstance, next); // and asign normal role
  });

  Doctor.observe('after delete', function(ctx, next) {
    helperDoctor.deleteOnCascade(ctx, next); // Delete contactBook when this contact is in it
  });

  Doctor.on('resetPasswordRequest', function(contactInstance) {
    helperDoctor.sendEmailPasswordReset(contactInstance);
  });

  Doctor.subscribeAlerts = helperDoctor.subscribeAlerts;

  Doctor.remoteMethod('subscribe-alerts', {

    http: {verb: 'get'},

    http: {path: '/:id/subscribe-alerts'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });

  Doctor.getRolesById = helperDoctor.getRolesById;

  Doctor.remoteMethod('get-roles-by-id', {

    http: {verb: 'get'},

    http: {path: '/:id/get-roles-by-id'},

    accepts: {arg: 'id', type: 'string', http: {source: 'path'}},

    returns: {arg: 'response', type: 'object', root: true},

  });
};
