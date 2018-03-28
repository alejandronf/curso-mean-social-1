'use strict'

var User = require('../models/user.js');
var bcrypt = require('bcrypt-nodejs');


function home(req, res){
    res.status(200).send({
      message: 'Server OK over UserJS Controller'
    });
}

function pruebas(req, res){
    console.log(req.body);
    res.status(200).send({
      message: 'Testing path /pruebas/ on server over UserJS Controller'
    });
}
// Saves an user to db
function saveUser(req, res){
  var params = req.body;
  var user = new User();

  if(params.name && params.surname && params.nick && params.email && params.password){
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = 'USER_ROLE';
    user.image = null;

    // Duplicated-Users control
    User.find({ $or: [
                          {email: user.email.toLowerCase()},
                          {nick: user.nick.toLowerCase()}
                        ]}).exec((err, users) => {
                          if(err) return res.status(400).send({message: 'Error en la petición de usuarios'});

                          if(users && users.length >= 1){
                            return res.status(400).send({message: 'El usuario que intenta registrar ya existe'});
                          }else{
                            // Password cypher by bcrypt lib
                            bcrypt.hash(params.password, null, null, (err, hash)=>{
                              user.password = hash;
                              user.save((err, userStored) =>{
                                if(err) return res.status(400).send({message: 'Error al guardar el usuario'});

                                if(userStored){
                                  res.status(200).send({user: userStored});
                                }else{
                                  res.status(400).send({message: 'No se ha registrado el usuario'});
                                }
                              });
                            });
                          }
                        });
  }else{
    res.status(400).send({message: 'Error. Envia todos los campos necesarios'});
  }
}

// Login function (just compare email and bcrypted passwords)
function loginUser(req,res){
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({email: email}, (err, user)=> {
    if(err) return res.status(400).send({message: 'Error en la petición'});

    if(user){
      bcrypt.compare(password, user.password, (err, check)=>{
        if(check){
          console.log("Usuario loggeado");
          return res.status(200).send({user});
        }else{
          // error
          return res.status(400).send({message: 'El usuario no se ha podido identificar'});
        }
      });
    }else{
      // we return the same message due to security
      return res.status(400).send({message: 'El usuario no se ha podido identificar'});
    }
  });
}

// export our modules to user routes
module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser
}
