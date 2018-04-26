'use strict';

module.exports = function(app) {
  var Doctor = app.models.Doctor;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Doctor.count({}, function(err, count) {
        // A: The datastore produced an error! Pass error to callback
    if (err) throw err;

    if (count == 0) {
      Doctor.create([
                {username: 'Jorge', email: 'jorge.cabrera.sanchez1@gmail.com', name: 'Jorge', surname: 'Cabrera Sánchez',  password: 'j12345', province: 'Madrid', emailVerified: true},
                {username: 'Adolfo', email: 'adolfogarciaescobar@gmail.com', name: 'Adolfo', surname: 'Gargia Escobar', password: 'j12345', province: 'Barcelona', emailVerified: true},
                {username: 'Antonio', email: 'patata@patata.com', password: 'j12345', name: 'Patata', surname: 'Patatin Lowren', province: 'Madrid', emailVerified: true},
      ], function(err, doctors) {
        if (err) throw err;
        console.log('Created doctors:', doctors);
                // create the admin role
        Role.create({
          name: 'admin',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
                    // make Jorge an admin
          for (let i = 0; i <= 1; i++) {
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: doctors[i].id,
              roleId: role.id,
            }, function(err, principal) {
              if (err) throw err;
              console.log(`Assigned user ${doctors[i].id} to role:`, role);
            });
          }
        });
        Role.create({
          name: 'normal',
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          // make other doctors role normal
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: doctors[2].id,
            roleId: role.id,
          }, function(err, principal) {
            if (err) throw err;
            console.log(`Assigned user ${doctors[2]} to role:`, role);
          });
        });
      });
    };
  });
};
