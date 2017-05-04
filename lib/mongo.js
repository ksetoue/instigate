'use strict';

const mongoose = require('mongoose');
const mongo = {};

mongo.mongoose = mongoose;

mongo.connect = function(callback){
  try{
    if(callback == undefined){
      callback = function(){}
    }
    mongoose.connect('mongodb://ltia-imaginecup:RRsmpegd02zXhjSZDRd2PaRrAFDNhhT60RtGs5s0PhZDAssiM3iBXKOy1zFPa0ozN9mBpDz2rylzG0f1n0iT9w==@ltia-imaginecup.documents.azure.com:10250/?ssl=true', callback);
  }catch(err){
    console.log('fail to create mongo connection');
  }

}

mongo.checkConnection = function(){
  return mongoose.connection.readyState === 1
}

mongo.disconnect = function(){
  try{
    mongoose.connection.disconnect();
  }catch(err){
    console.log('fail to destroy mongo connection')
  }
}

module.exports = mongo;
