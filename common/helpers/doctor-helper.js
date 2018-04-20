'use strict';

module.exports = function HelperDoctor(Doctor) {
  let path = require('path');
  let loopback = require('loopback');
  let admin = require('firebase-admin');
  let serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');
  const ipFront = require('../../server/config.json').remoting.ipFront;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
  });

  this.sendVerifyEmail = (doctorInstance, next) => {
    console.log('> send verify email');

    let options = {
      type: 'email',
      to: doctorInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: 'http://localhost:4200',
      user: doctorInstance,
      text: '{href}',
    };

    doctorInstance.verify(options, function(err, response, cb) {
      if (err) return next(new Error(err));

      console.log('> verification email sent:', response);

      let RoleMappingModel = Doctor.app.models.RoleMapping;
      let RoleModel = Doctor.app.models.Role;

      RoleModel.findOne({where: {name: 'normal'}}, (err, role) => {
        if (err) return next(new Error(err));
        role.principals.create({
          principalType: RoleMappingModel.USER,
          principalId: doctorInstance.id,
          roleId: role.id,
        }, function(err, principal) {
          if (err) return next(new Error(err));
          console.log(`Assigned user ${doctorInstance.id} to role:`, role.name);
          return next(null, response);
        });
      });
          // Finish asing role
    });
        // finish verify
  };

  this.getRolesById = (id, next) => {
    Doctor.findById(id, (err, persisteddoctor) => {
      if (err) return next(new Error(err));
      let RoleMappingModel = Doctor.app.models.RoleMapping;
      let RoleModel = Doctor.app.models.Role;

      RoleMappingModel.findOne({where: {principalId: id}}, (err, role) => {
        if (err) return next(new Error(err));
        if (!role) { return next(new Error('No role found for this doctor')); }

        RoleModel.findOne({where: {id: role.roleId}}, (err, doctorRoles) => {
          if (err) return next(new Error(err));
          return next(null, doctorRoles);
        });
      });
    });
  };

  this.deleteOnCascade = (ctx, next) => {
    const doctorId = ctx.where.id.inq[0];

    let RoleMappingModel = Doctor.app.models.RoleMapping;
    RoleMappingModel.findOne({where: {principalId: doctorId}}, (err, roleMappingInstance) => {
      if (err) return next(new Error(err));
      if (!roleMappingInstance) { return next(new Error('No role found for this doctor')); }

      roleMappingInstance.remove();
      // Delete RoleMapping
      next(null, roleMappingInstance);
    });
    // Finish find roleMapping
  };

  this.sendEmailPasswordReset = (doctorInstance) => {
    var url = `http://${ipFront}:4200/new-password?access_token=${doctorInstance.accessToken.id}`;
    var myMessage = {text: url};
 
    // prepare a loopback template renderer
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
    var htmlBody = renderer(myMessage);
    // 'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    Doctor.app.models.Email.send({
      to: doctorInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Password reset',
      html: htmlBody,
    }, function(err) {
      if (err) return console.log(err);
      console.log('> sending password reset email to:', doctorInstance.email);
    });
  };
    // Find finish
  this.subscribeAlerts = (doctorId, next) => {
    Doctor.findById({id: doctorId}, function(err, doctorInstance) {
      console.log(doctorInstance);
      // This registration token comes from the client FCM SDKs.
      var registrationToken = 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...';

      // See the "Defining the message payload" section below for details
      // on how to define a message payload.
      var payload = {
            data: {
              score: '850',
              time: '2:45',
            },
          };

      // Send a message to the device corresponding to the provided
      // registration token.
      admin.messaging().sendToDevice(registrationToken, payload)
            .then(function(response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
              console.log('Successfully sent message:', response);
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });

      next(null, true);
    });
  };
};
