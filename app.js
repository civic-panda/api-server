var express = require('express');
var request = require('request');
var cors = require('cors');

var apiServerHost = 'https://congress.api.sunlightfoundation.com';
var app = express();

// app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);

  return next();
});

app.use('/test', function(req, res) {
  res.send('hello world');
});

app.use('/', function(req, res) {
  var url = apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || 3000);