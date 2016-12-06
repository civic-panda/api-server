var express = require('express');
var request = require('request');
var fetch = require('node-fetch');

var congress = require('./congress-data/legislators-current.json');

var apiServerHost = 'https://congress.api.sunlightfoundation.com';
var app = express();

function getReps(state, district) {
  return congress.filter(function(congressPerson) {
    var latestTerm = congressPerson.terms[congressPerson.terms.length - 1];
    return latestTerm.state === state && (latestTerm.type === 'sen' || latestTerm.district === district)
  });
}

app.use(function (req, res, next) {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);

  return next();
});

app.use('/test', function(req, res) {
  res.send('hello world');
});

app.use('/congress', function(req, res) {
  res.json(congress);
});

app.use('/', function(req, res) {
  var url = apiServerHost + req.url;
  return fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if (json.results && json.results.length) {
        var state = json.results[0].state;
        var district = json.results[0].district;
        var reps = getReps(state, district);
      } else {
        var state = null;
        var district = null;
        var reps = [];
      }

      res.json({ state, district, reps });
    })
    .catch(function(err) {
      console.log(err)
    });
});

app.listen(process.env.PORT || 3000);