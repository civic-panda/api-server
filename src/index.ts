import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import fetch from 'node-fetch';

import apiRouter from './controllers';
import * as congress from './congress';

// const cmsUrl = 'http://localhost:3000';
const cmsUrl = 'https://admin.actonthis.org';
// const cmsUrl = 'https://act-on-this-cms-staging.herokuapp.com';
const sunlightUrl = 'https://congress.api.sunlightfoundation.com';
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

// if ( process.env.NODE_ENV === 'development') {
  // console.log('getting bundle');
  // app.get('/js/bundle.js', require('browserify-middleware')(__dirname + '/client/index.ts', {
  //   extensions: ['ts']
  // }));
  // var browserify = require('browserify');
  // var tsify = require('tsify');

  // app.get('/js/bundle.js', express.static(__dirname + '/public'));
// }

app.options('*', cors());

app.use((req, res, next) => {
  if (req.header('Origin')) {
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  return next();
});

app.use(express.static(__dirname + '/public'));
app.use('/api', apiRouter);

app.get('/data', async (_req, res) => {
  const causesUrl = cmsUrl + '/api/causes';
  const tasksUrl = cmsUrl + '/api/tasks';
  const responses = await Promise.all([fetch(causesUrl), fetch(tasksUrl)]);
  const [{ causes }, { tasks }] = await Promise.all(responses.map(response => response.json()));
  causes.map((cause: any) => cause.id = cause._id);
  tasks.map((task: any) => {
    task.id = task._id;
    if (task.location.geo) {
      const [longitude, latitude] = task.location.geo;
      task.location.longitude = longitude;
      task.location.latitude = latitude;
    }
    const committee = task.templateProps ? task.templateProps.committee : undefined;
    if (committee && task.templateProps[committee + '_subcommittee']) {
      task.templateProps.subcommittee = task.templateProps[committee + '_subcommittee'];
    }
  });
  res.json({ causes, tasks });
});

app.get('/committees/:committeeId/subcommittees/:subcommitteeId', async (req, res) => {
  try {
    res.json(congress.getCommitteeMembers(req.params.committeeId, req.params.subcommitteeId));
  } catch (e) {
    res.sendStatus(404);
  }
});

app.get('/committees/:committeeId', async (req, res) => {
  try {
    res.json(congress.getCommitteeMembers(req.params.committeeId));
  } catch (e) {
    res.sendStatus(404);
  }
});

app.post('/email-subscribers', async (req, res) => {
  try {
    const response = await fetch(cmsUrl + '/api/email-subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (response.ok) {
      const json = await response.json();
      res.send(json);
    } else {
      throw response;
    }
  } catch (e) {
    res.sendStatus(e.status || 400);
  }
});

app.use('/', async (req, res) => {
  const url = sunlightUrl + req.url;
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

// AWS Health Check
app.use('/test', (_req, res) => {
  res.sendStatus(200);
})

app.use((err: any, _req: any, res: any, next:any) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }

  res.status(err.status).send(err);

  return next();
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log(`listening on port ${port}`);
