'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso'; // secret key to encode our payload

exports.createToken = function(user){
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(), // token date of creation
    exp: moment().add(30, 'days').unix() // token expiry setted + 30 days
  };

  return jwt.encode(payload, secret); // encode our payload

};
