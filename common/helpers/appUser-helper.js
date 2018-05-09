'use strict';

module.exports = function HelperAppUser(AppUser) {
  let path = require('path');
  let loopback = require('loopback');
  let admin = require('firebase-admin');
  const serviceAccount = require('../../credentials/app-pruebas-972aa-firebase-adminsdk-db8la-aceac291ba.json');
  const ipFront = require('../../server/config.json').remoting.ipFront;

  // AppUser.observe('loaded', function(ctx, next) {
  //   Alert = AppUser.app.models.Alert;    // works!
  //   next(null, true);
  // });
  if (!admin) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
    });
  }

  // var db = admin.database();

  this.sendVerifyEmail = (appUserInstance, next) => {
    console.log('> send verify email');

    let options = {
      type: 'email',
      to: appUserInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: 'http://localhost:4200',
      user: appUserInstance,
      text: '{href}',
    };

    appUserInstance.verify(options, function(err, response, cb) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

      let RoleMappingModel = AppUser.app.models.RoleMapping;
      let RoleModel = AppUser.app.models.Role;

      RoleModel.findOne({where: {name: 'technician'}}, (err, role) => {
        if (err) return next(new Error(err));
        role.principals.create({
          principalType: RoleMappingModel.USER,
          principalId: appUserInstance.id,
          roleId: role.id,
        }, function(err, principal) {
          if (err) return next(new Error(err));
          console.log(`Assigned user ${appUserInstance.id} to role:`, role.name);
          return next(null, response);
        });
      });
          // Finish asing role
    });
        // finish verify
  };

  this.getRolesById = (id, next) => {
    AppUser.findById(id, (err, persistedappUser) => {
      if (err) return next(new Error(err));
      let RoleMappingModel = AppUser.app.models.RoleMapping;
      let RoleModel = AppUser.app.models.Role;

      RoleMappingModel.findOne({where: {principalId: id}}, (err, role) => {
        if (err) return next(new Error(err));
        if (!role) { return next(new Error('No role found for this appUser')); }

        RoleModel.findOne({where: {id: role.roleId}}, (err, appUserRoles) => {
          if (err) return next(new Error(err));
          return next(null, appUserRoles);
        });
      });
    });
  };

  this.deleteOnCascade = (ctx, next) => {
    const appUserId = ctx.where.id.inq[0];

    let RoleMappingModel = AppUser.app.models.RoleMapping;
    RoleMappingModel.findOne({where: {principalId: appUserId}}, (err, roleMappingInstance) => {
      if (err) return next(err);
      if (!roleMappingInstance) { return next(new Error('No role found for this appUser')); }
      // Delete RoleMapping
      roleMappingInstance.remove();

      let AccessTokenModel = AppUser.app.models.AccessToken;
      AccessTokenModel.findOne({where: {userId: appUserId}}, (err, accessTokenInstance) => {
        if (err) return next(err);
        if (!accessTokenInstance) { return next(new Error('No accessToken found for this appUser')); }
        // Delete AccessToken
        accessTokenInstance.remove();

        return next(null, next);
        // Finish find accessToken
      });
    // Finish find roleMapping
    });
  };

  this.sendEmailPasswordReset = (appUserInstance) => {
    console.log(appUserInstance);
    var url = `http://${ipFront}/new-password?access_token=${appUserInstance.accessToken.id}`;
    var myMessage = {text: url};

    // prepare a loopback template renderer
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
    var htmlBody = renderer(myMessage);
    // 'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    AppUser.app.models.Email.send({
      to: appUserInstance.email,
      from: 'apppracticasgnommo@gmail.com',
      subject: 'Password reset',
      html: htmlBody,
    }, function(err) {
      if (err) return console.log(err);
      console.log('> sending password reset email to:', appUserInstance.email);
    });
  };

  this.getAlertsByOwnerProvince = (id, next) => {
    const {Alert} = AppUser.app.models;
    AppUser.findById(id, function(err, appUserInstance) {
      if (err) return next(err);
      Alert.find({where: {'province': appUserInstance.province}}, function(err, alerts) {
        if (err) return next(err);
        return next(null, alerts);
      });
    });
  };

  this.assignAlert = (id, alertId, next) => {
    const {Alert} = AppUser.app.models;
    AppUser.getRolesById(id, (err, role) => {
      if (err) return next(err);
      if (role.name != 'technician') {
        return next(new Error('Only a technician can\'t be a owner'));
      }

      Alert.findById(alertId, function(err, alertInstance) {
        if (err) return next(err);
        if (alertInstance.owner) {
          return next(new Error('Alert is already assigned'));
        }
        alertInstance.updateAttributes({owner: id, assigned: true}, function(err, instance) {
          if (err) return next(err);
          return next(null, instance);
        });
      });
    });
  };

  this.generateNotificationForProvince = (province, next) => {

  };

  this.assignRole = (id, role, next) => {
    let RoleMappingModel = AppUser.app.models.RoleMapping;
    let RoleModel = AppUser.app.models.Role;

    RoleMappingModel.findOne({where: {principalId: id}}, (err, roleMapping) => {
      if (err) return next(err);
      RoleMappingModel.deleteById(roleMapping.id, (err, roleMappingDelete) => {
        if (err) return next(err);
        return next(null, roleMappingDelete);
      });
    }); // COMPROBAR ESTO

    RoleModel.findOne({where: {name: role}}, (err, role) => {
      if (err) return next(err);
      role.principals.create({
        principalType: RoleMappingModel.USER,
        principalId: id,
        roleId: role.id,
      }, function(err, principal) {
        if (err) return next(err);
        console.log(`Assigned user ${id} to role:`, role.name);
        return next(null, true);
      });
    });
  };

  this.getCreatedAlerts = (id, next) => {
    const Alerts = AppUser.app.models.Alerts;
    Alerts.find({where: {creator: id}}, (err, alerts) => {
      if (err) return next(err);
      return next(null, alerts);
    });
  };

  // this.deleteAccessToken = (context, appUserInstance, next) => {
  //   let AccessTokenModel = AppUser.app.models.AccessToken;
  //   AccessTokenModel.findOne({where: {_id: context.args.access_token}}, (err, accessTokenInstance) => {
  //     console.log(accessTokenInstance);
  //     if (err) return next(new Error(err));
  //     if (!accessTokenInstance) { return next(new Error('No accessToken found for this appUser')); }
  //     // Delete AccessToken
  //     accessTokenInstance.remove();

  //     next(null, next);
  //     // Finish find accessToken
  //   });
  // };

    // Find finish

    // Subscribe alert
  // this.subscribeAlerts = (appUserId, next) => {
  //   AppUser.findById(appUserId, (err, appUserInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = appUserInstance.registrationToken;
  //     var province = appUserInstance.province;

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
  // this.unsubscribeAlerts = (appUserId, next) => {
  //   AppUser.findById(appUserId, (err, appUserInstance) => {
  //     if (err) throw err;

  //     // This registration token comes from the client FCM SDKs.
  //     var registrationToken = appUserInstance.registrationToken;
  //     var province = appUserInstance.province;

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

