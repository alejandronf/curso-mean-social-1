'use strict'

// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res){
    var params = req.body; // we get the params from http body
    var follow = new Follow(); // lets create a new object

    follow.user = req.user.sub;
    follow.followed = params.followed;

    if(!follow.followed) return res.status(500).send({message: 'Error al seguir. No has especificado a quién quieres seguir'}); // throw error if we don't get the follow id

    follow.save((err, followStored) =>{ // lets save
      if(err) return res.status(500).send({message: 'Error al seguir'}); // if we get a error, we throw a 500 status
      if(!followStored) return res.status(404).send({message: 'Error al seguir (No se ha seguido)'}); // and if follow isn't stored, we throw a 404

      return res.status(200).send({follow:followStored}); // we save our follow

    });

}

function deleteFollow(req, res){
  var userId = req.user.sub; // request from md_auth to get userId
  var followId = req.params.id; // user to stop follow

  Follow.find({'user': userId, 'followed': followId}).remove(err =>{ // we need to do this query to delete by user and followed (on our db)
    if (err) return res.status(500).send({message: 'Error al dejar de seguir'}); // if we got a error, lets throw a 500

    return res.status(200).send({message: 'Se ha dejado de seguir exitosamente'}); // we tell the user that he's not following anymore
  });
}

function getFollowingUsers(req, res){
  var userId = req.user.sub; // we request OUR user from md_auth
  var page = 1; // default number of pages
  var itemsPerPage = 4; // default items per page

  if(req.params.id && req.params.page){ // if we get from url an id, lets replace it
    userId = req.params.id;
  }

  if(req.params.page){ // and if we get number of pages from url, lets replace it
    page = req.params.page;
  }else{ // else, this is an id
    page = req.params.id;
  }

// now we have to find the follows with pagination, but we populate/replace the "followed" with user object !

  Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) =>{
    if (err) return res.status(500).send({message: 'Error en el servidor al obtener follows'}); // if we have something bad on our server, throw a 500
    if (!follows) return res.status(404).send({message: 'No se han encontrado follows'}); // if we don't get any follow from the user, we return a 404

    return res.status(200).send({ // we return the total of follows, the number of pages (total divided by itemsPerPage) and our follows
      total: total,
      pages: Math.ceil(total/itemsPerPage),
      follows
    });
  });
}
// we export everything to our route
module.exports = {
  saveFollow,
  deleteFollow,
  getFollowingUsers
}
