'use strict';

const ApiRouter = require('express').Router();

const ApiRoutes = require('./api/index.js');
const Middleware = require('../middleware');

// Middleware
ApiRouter.use(Middleware.MongoConnection);
ApiRouter.use('/records', Middleware.JWTValidations.AuthMiddleware);

// Rotas
ApiRouter.use('/user', ApiRoutes.UserRouter);
ApiRouter.use('/records', ApiRoutes.RecordsRouter);
ApiRouter.use('/category', ApiRoutes.CategoryRouter);

module.exports = ApiRouter;
