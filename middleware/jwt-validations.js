'use strict'
const jwt = require('jsonwebtoken');

const User = require('../model/user.js')

const JWTValidations = {};
const salt = '86402e1f4af2d23b584fb7814589e930';

JWTValidations.AuthMiddleware = function(req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, salt, function(err, decoded) {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token.' });
      } else {
        User.findOne({
          _id: decoded._doc._id
        }, function(err, user){
          if (err || !user){
            return res.status(401).json({ message: 'Failed to Authenticate token' });
          }
          req.decoded = decoded;
          req.user = user;
          next();
        });
        // if everything is good, save to request for use in other routes
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};

JWTValidations.salt = salt;

module.exports = JWTValidations;
