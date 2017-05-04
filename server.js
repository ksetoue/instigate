'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');

const app = express();
const Routes = require('./route')


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(busboy())

// Server variables
app.set('port', process.env.PORT || 3000);

// Routes
app.use('/web', express.static('front'));
app.use('/api', Routes.ApiRouter);

// redirect to root
app.get('/', function(req, res){
  return res.redirect(301, `http://${req.get('Host')}/web`);
})

// start server
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
