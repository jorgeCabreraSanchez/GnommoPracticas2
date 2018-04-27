'use strict';

module.exports = function HelperDoctor(Doctor) {
  let path = require('path');
  let loopback = require('loopback');
  let admin = require('firebase-admin');
  const serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');
  const ipFront = require('../../server/config.json').remoting.ipFront;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
  });
  var db = admin.database();

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
      if (err) return next(err);

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
      if (err) return next(err);
      if (!roleMappingInstance) { return next(new Error('No role found for this doctor')); }
      // Delete RoleMapping
      roleMappingInstance.remove();

      let AccessTokenModel = Doctor.app.models.AccessToken;
      AccessTokenModel.findOne({where: {userId: doctorId}}, (err, accessTokenInstance) => {
        if (err) return next(err);
        if (!accessTokenInstance) { return next(new Error('No accessToken found for this doctor')); }
        // Delete AccessToken
        accessTokenInstance.remove();

        next(null, next);
        // Finish find accessToken
      });
    // Finish find roleMapping
    });
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

  this.getAlertsByProvince = (province, next) => {
    // firebase
    var ref = db.ref(`${province}/Alerts`);
    ref.once('value', function(data) {
      next(null, data);
    });
  };

  this.assignAlert = (id, alertId, next) => {
    // firebase
    Doctor.findById(id, (err, doctorInstance) => {
      if (err) throw err;
      if (!doctorInstance) next(new Error('Doctor don\'t found '));

      var ref = db.ref(`${doctorInstance.province}/Alerts/${alertId}`);
      ref.update({
        'assigned': true,
        'owner': id,
      });
      next(null, true);
    });
  };

  // this.deleteAccessToken = (context, doctorInstance, next) => {
  //   let AccessTokenModel = Doctor.app.models.AccessToken;
  //   AccessTokenModel.findOne({where: {_id: context.args.access_token}}, (err, accessTokenInstance) => {
  //     console.log(accessTokenInstance);
  //     if (err) return next(new Error(err));
  //     if (!accessTokenInstance) { return next(new Error('No accessToken found for this doctor')); }
  //     // Delete AccessToken
  //     accessTokenInstance.remove();

  //     next(null, next);
  //     // Finish find accessToken
  //   });
  // };

    // Find finish

    // Subscribe alert
  // this.subscribeAlerts = (doctorId, next) => {
  //   Doctor.findById(doctorId, (err, doctorInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = doctorInstance.registrationToken;
  //     var province = doctorInstance.province;

  //     // The topic name can be optionally prefixed with "/topics/".
  //     var topic = `/topics/Madrid`;

  //     // Subscribe the device corresponding to the registration token to the
  //     // topic.
  //     admin.messaging().subscribeToTopic(registrationToken, topic)
  //       .then(function(response) {
  //   // See the MessagingTopicManagementResponse reference documentation
  //   // for the contents of response.
  //         console.log('Successfully subscribed to topic:', response);
  //         next(null, response);
  //       })
  //       .catch(function(error) {
  //         console.log('Error subscribing to topic:', error);
  //         next(error);
  //       });
  //   });
  // };

  // // Unsubscribe Alert
  // this.unsubscribeAlerts = (doctorId, next) => {
  //   Doctor.findById(doctorId, (err, doctorInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = doctorInstance.registrationToken;
  //     var province = doctorInstance.province;

  //     // The topic name can be optionally prefixed with "/topics/".
  //     var topic = `/topics/${province}`;

  //     // unSubscribe the device corresponding to the registration token to the
  //     // topic.
  //     admin.messaging().unsubscribeToTopic(registrationToken, topic)
  //       .then(function(response) {
  //   // See the MessagingTopicManagementResponse reference documentation
  //   // for the contents of response.
  //         console.log('Successfully unsubscribed to topic:', response);
  //         next(null, response);
  //       })
  //       .catch(function(error) {
  //         console.log('Error unsubscribing to topic:', error);
  //         next(error);
  //       });
  //   });
  // };
};

