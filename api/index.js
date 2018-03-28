'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// conexión a la bd
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
        .then(() =>{
          console.log("Successfully connected to database")

          // creación del servidor
          app.listen(port, () =>{
            console.log("Server ok, running at http://localhost:3800");
          });
        })
        .catch(err => console.log(err));
