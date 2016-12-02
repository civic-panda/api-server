var express = require('express');
var request = require('request');
var cors = require('cors');

var apiServerHost = 'https://congress.api.sunlightfoundation.com';
var app = express();

app.use(cors());

app.use('/test', function(req, res) {
  res.send('hello world');
});

app.use('/', function(req, res) {
  var url = apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || 3000);