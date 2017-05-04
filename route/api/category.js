'use strict';

const CategoryRouter = require('express').Router();

const Category = require('../../model/category.js');

const JWTValidations = require('../../middleware').JWTValidations;

function insert(req, res){
  let status = 201;
  let name = req.body.name;
  let url = req.body.url;


  let newCategory = new Category({
    name,
    url
  });

  newCategory.save(function(err){
    if(err){
      status = 500;
      if(err.code == 11000){
        status = 409;
      }
      res.status(status).json({message: err});
    }else{
      res.status(status).json({message: 'Category Registered'});
    }
  })
}

function remove(req, res){
  Category.remove({
    name: req.params.name
  }).then(function(){
    return res.status(204).end();
  }).catch(function(){
    return res.status(500).json({message: 'Database operation error'});
  })
}

function listCategories(req, res){
  Category.find({}).then(function(users){
    res.status(200).json({result: users})
  }).catch(function(error){
    res.status(500).json({message: "Database error."})
  })
}

CategoryRouter.get('/', listCategories);
CategoryRouter.post('/', JWTValidations.AuthMiddleware, insert)
CategoryRouter.delete('/', JWTValidations.AuthMiddleware, remove)

module.exports = CategoryRouter;
