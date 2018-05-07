'use strict';

module.exports = function HelperTechnician(Technician) {
  let path = require('path');
  let loopback = require('loopback');
  let admin = require('firebase-admin');
  const serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');
  const ipFront = require('../../server/config.json').remoting.ipFront;

  // Technician.observe('loaded', function(ctx, next) {
  //   Alert = Technician.app.models.Alert;    // works!
  //   next(null, true);
  // });
  if (!admin) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
    });
  }

  // var db = admin.database();

  this.sendVerifyEmail = (technicianInstance, next) => {
    console.log('> send verify email');

    let options = {
      type: 'email',
      to: technicianInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: 'http://localhost:4200',
      user: technicianInstance,
      text: '{href}',
    };

    technicianInstance.verify(options, function(err, response, cb) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

      let RoleMappingModel = Technician.app.models.RoleMapping;
      let RoleModel = Technician.app.models.Role;

      RoleModel.findOne({where: {name: 'normal'}}, (err, role) => {
        if (err) return next(new Error(err));
        role.principals.create({
          principalType: RoleMappingModel.USER,
          principalId: technicianInstance.id,
          roleId: role.id,
        }, function(err, principal) {
          if (err) return next(new Error(err));
          console.log(`Assigned user ${technicianInstance.id} to role:`, role.name);
          return next(null, response);
        });
      });
          // Finish asing role
    });
        // finish verify
  };

  this.getRolesById = (id, next) => {
    Technician.findById(id, (err, persistedtechnician) => {
      if (err) return next(new Error(err));
      let RoleMappingModel = Technician.app.models.RoleMapping;
      let RoleModel = Technician.app.models.Role;

      RoleMappingModel.findOne({where: {principalId: id}}, (err, role) => {
        if (err) return next(new Error(err));
        if (!role) { return next(new Error('No role found for this technician')); }

        RoleModel.findOne({where: {id: role.roleId}}, (err, technicianRoles) => {
          if (err) return next(new Error(err));
          return next(null, technicianRoles);
        });
      });
    });
  };

  this.deleteOnCascade = (ctx, next) => {
    const technicianId = ctx.where.id.inq[0];

    let RoleMappingModel = Technician.app.models.RoleMapping;
    RoleMappingModel.findOne({where: {principalId: technicianId}}, (err, roleMappingInstance) => {
      if (err) return next(err);
      if (!roleMappingInstance) { return next(new Error('No role found for this technician')); }
      // Delete RoleMapping
      roleMappingInstance.remove();

      let AccessTokenModel = Technician.app.models.AccessToken;
      AccessTokenModel.findOne({where: {userId: technicianId}}, (err, accessTokenInstance) => {
        if (err) return next(err);
        if (!accessTokenInstance) { return next(new Error('No accessToken found for this technician')); }
        // Delete AccessToken
        accessTokenInstance.remove();

        next(null, next);
        // Finish find accessToken
      });
    // Finish find roleMapping
    });
  };

  this.sendEmailPasswordReset = (technicianInstance) => {
    console.log(technicianInstance);
    var url = `http://${ipFront}/new-password?access_token=${technicianInstance.accessToken.id}`;
    var myMessage = {text: url};

    // prepare a loopback template renderer
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
    var htmlBody = renderer(myMessage);
    // 'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    Technician.app.models.Email.send({
      to: technicianInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Password reset',
      html: htmlBody,
    }, function(err) {
      if (err) return console.log(err);
      console.log('> sending password reset email to:', technicianInstance.email);
    });
  };

  this.getAlertsByOwnerProvince = (id, next) => {
    const {Alert} = Technician.app.models;
    Technician.findById(id, function(err, technicianInstance) {
      if (err) next(err);
      Alert.find({'province': technicianInstance.province}, function(err, alerts) {
        if (err) next(err);
        next(null, alerts);
      });
    });
  };

  this.assignAlert = (id, alertId, next) => {
    const {Alert} = Technician.app.models;
    Alert.findById(alertId, function(err, alertInstance) {
      if (err) next(err);
      alertInstance.updateAttributes({owner: id, assigned: true, state: 'unfinished'}, function(err, instance) {
        if (err) next(err);
        next(null, instance);
      });
    });
  };

  this.generateNotificationForProvince = (province, next) => {

  };

  // this.deleteAccessToken = (context, technicianInstance, next) => {
  //   let AccessTokenModel = Technician.app.models.AccessToken;
  //   AccessTokenModel.findOne({where: {_id: context.args.access_token}}, (err, accessTokenInstance) => {
  //     console.log(accessTokenInstance);
  //     if (err) return next(new Error(err));
  //     if (!accessTokenInstance) { return next(new Error('No accessToken found for this technician')); }
  //     // Delete AccessToken
  //     accessTokenInstance.remove();

  //     next(null, next);
  //     // Finish find accessToken
  //   });
  // };

    // Find finish

    // Subscribe alert
  // this.subscribeAlerts = (technicianId, next) => {
  //   Technician.findById(technicianId, (err, technicianInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = technicianInstance.registrationToken;
  //     var province = technicianInstance.province;

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
  // this.unsubscribeAlerts = (technicianId, next) => {
  //   Technician.findById(technicianId, (err, technicianInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = technicianInstance.registrationToken;
  //     var province = technicianInstance.province;

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

