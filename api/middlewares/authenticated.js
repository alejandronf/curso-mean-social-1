'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso'; // secret key to decode our payload

// auth-function by jwt
exports.ensureAuth = function(req, res, next){ // request, response and a 'jump-to'

    if(!req.headers.authorization){ // if we don't receive an auth header
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'}); // we throw a 403 unauthorized with a message
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // we clean our token and removes '' and ""

    try{
      var payload = jwt.decode(token, secret); // decode our token
      if(payload.exp <= moment().unix()){ // if token expiry date is <= actual datetime
        return res.status(401).send({message: 'El token ha expirado'}); // we throw a 401
      }
    }catch(ex){
        return res.status(400).send({message: 'El token no es válido'}); // if we get an exception, we throw a 400 status
    }

    req.user = payload;

    next();
};
