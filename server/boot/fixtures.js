'use strict';

module.exports = function(app) {
  var AppUser = app.models.AppUser;
  var HospitalUser = app.models.HospitalUser;
  var Technician = app.models.Technician;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var AccesToken = app.models.AccessToken;

  AppUser.count({}, function(err, count) {
        // A: The datastore produced an error! Pass error to callback
    if (err) throw err;

    if (count == 0) {
      AppUser.create([
                {username: 'Jorge', email: 'jorge.cabrera.sanchez1@gmail.com', name: 'Jorge', surname: 'Cabrera Sánchez',  password: 'j12345', province: 'Madrid', emailVerified: true},
                {username: 'Adolfo', email: 'adolfogarciaescobar@gmail.com', name: 'Adolfo', surname: 'Gargia Escobar', password: 'j12345', province: 'Barcelona', emailVerified: true},
                {username: 'Antonio', email: 'patata@patata.com', password: 'j12345', name: 'Patata', surname: 'Patatin Lowren', province: 'Madrid', emailVerified: true},
      ], function(err, appUsers) {
        if (err) throw err;
        console.log('Created users:', appUsers);

        // create the admin role
        Role.create({
          name: 'admin',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: appUsers[0].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${appUsers[0].id} to role:`, role);
          });
        });
        Role.create({
          name: 'hospitalUser',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: appUsers[1].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${appUsers[1].id} to role:`, role);
          });
        });
        Role.create({
          name: 'technician',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          // make other appUsers role normal
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: appUsers[2].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${appUsers[2]} to role:`, role);
          });
        });
      });
    };
  });
};
