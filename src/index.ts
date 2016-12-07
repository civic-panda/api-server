import * as express from 'express';
import * as morgan from 'morgan';
import fetch from 'node-fetch';

import * as congress from './congress';

var apiServerHost = 'https://congress.api.sunlightfoundation.com';
var app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.header('Origin')) {
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  return next();
});

app.use('/', async (req, res) => {
  const url = apiServerHost + req.url;
  const response = await fetch(url);
  const json = await response.json();

  if (json.results && json.results.length) {
    const state = json.results[0].state;
    const district = json.results[0].district;
    const representatives = congress.getRepresentatives(state, district);
    const senators = congress.getSenators(state);

    res.json({ state, district, representatives, senators });
  } else {
    res.json({});
  }

});

app.listen(process.env.PORT || 3000);
