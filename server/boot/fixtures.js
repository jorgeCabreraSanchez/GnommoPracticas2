'use strict';

module.exports = function(app) {
  var Technician = app.models.Technician;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var AccesToken = app.models.AccessToken;

  Technician.count({}, function(err, count) {
        // A: The datastore produced an error! Pass error to callback
    if (err) throw err;

    if (count == 0) {
      Technician.create([
                {username: 'Jorge', email: 'jorge.cabrera.sanchez1@gmail.com', name: 'Jorge', surname: 'Cabrera Sánchez',  password: 'j12345', province: 'Madrid', emailVerified: true},
                {username: 'Adolfo', email: 'adolfogarciaescobar@gmail.com', name: 'Adolfo', surname: 'Gargia Escobar', password: 'j12345', province: 'Barcelona', emailVerified: true},
                {username: 'Antonio', email: 'patata@patata.com', password: 'j12345', name: 'Patata', surname: 'Patatin Lowren', province: 'Madrid', emailVerified: true},
      ], function(err, technicians) {
        if (err) throw err;
        console.log('Created technicians:', technicians);

        // create the admin role
        Role.create({
          name: 'admin',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: technicians[0].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${technicians[0].id} to role:`, role);
          });
        });
        Role.create({
          name: 'hospital',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: technicians[1].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${technicians[1].id} to role:`, role);
          });
        });
        Role.create({
          name: 'technician',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          // make other technicians role normal
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: technicians[2].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${technicians[2]} to role:`, role);
          });
        });
      });
    };
  });
};
