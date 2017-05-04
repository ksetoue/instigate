'use strict';
const mongo = require('../lib/mongo');

const MongoConnection = function(req, res, next){
  if(mongo.checkConnection()){
    return next();
  }
  else{
    mongo.connect(function(err){
      if(err){
        return res.status(500).json({ message: 'Database connection error.' });
      }
      next();
    })
  }
}

module.exports = MongoConnection;
