'use strict';

const RecordsRouter = require('express').Router();

RecordsRouter.get('/', function(req, res){
  res.status(200).json({message: 'record data'});
});

module.exports = RecordsRouter;
