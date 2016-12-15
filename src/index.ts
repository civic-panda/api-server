import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
// import * as request from 'request';
import fetch from 'node-fetch';

import * as congress from './congress';

// const cmsUrl = 'http://localhost:3000';
const cmsUrl = 'https://admin.actonthis.org';
const sunlightUrl = 'https://congress.api.sunlightfoundation.com';
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

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

app.get('/data', async (_req, res) => {
  const issuesUrl = cmsUrl + '/api/issues';
  const tasksUrl = cmsUrl + '/api/tasks';
  const responses = await Promise.all([fetch(issuesUrl), fetch(tasksUrl)]);
  const [{ issues }, { tasks }] = await Promise.all(responses.map(response => response.json()));

  issues.map((issue: any) => issue.id = issue._id);
  tasks.map((task: any) => {
    task.id = task._id;
    if (task.location.geo) {
      const [longitude, latitude] = task.location.geo;
      task.location.longitude = longitude;
      task.location.latitude = latitude;
    }
    const committee = task.templateProps.committee;
    if (committee && task.templateProps[committee + '_subcommittee']) {
      task.templateProps.subcommittee = task.templateProps[committee + '_subcommittee'];
    }
  });
  res.json({ issues, tasks });
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

app.listen(process.env.PORT || 3000);
