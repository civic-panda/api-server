import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import fetch from 'node-fetch';

import apiRouter from './controllers';
import * as congress from './congress';

var watson = require('watson-developer-cloud');
var _=require('lodash')

const alchemy_language = watson.alchemy_language({
  api_key: '53cef52af1d2c28849feec99cd787bada13bb439'
});

// const cmsUrl = 'http://localhost:3000';
const cmsUrl = 'https://admin.actonthis.org';
// const cmsUrl = 'https://act-on-this-cms-staging.herokuapp.com';
const sunlightUrl = 'https://congress.api.sunlightfoundation.com';
const openstatesUrl = 'https://openstates.org';
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

app.get('/bookmarklet', async (req:any, res:any) =>{
  try {
    let url:string = req.query.url;
    if (!url) {
      url = 'http://www.slate.com/articles/double_x/doublex/2015/12/rape_victims_are_still_being_charged_for_rape_kits.html';
    }
    const alchemy_parameters = {
      extract: 'title,text,concepts,keywords,entities',
      sentiment: 1,
      maxRetrieve: 3,
      showSourceText: 1,
      url: url
    };

    alchemy_language.combined(alchemy_parameters, (err:string, response:any) => {
      if (err) {
        console.log('error:', err);
        res.sendStatus(404);
      } else {
        // const title = response.title;
        const keywordArr = _.map(response.keywords,'text');
        const conceptsArr = _.map(response.concepts,'text');
        const entitiesArr = _.map(response.entities,'text')

        var combinedArray = _.concat(keywordArr,conceptsArr,entitiesArr);
        combinedArray = _.uniq(_.map(combinedArray, _.method('toLowerCase')));
        var html ='<!doctype html><html><head><style type="text/css">'
        html+="@import 'https://fonts.googleapis.com/css?family=Space+Mono';"
        html+='.logo{height:40px;mix-blend-mode:multiply; margin-left: 10px; margin-top: 5px;} .actimg{width:400px;mix-blend-mode:multiply} *{font-size:12px;font-family:Space Mono,serif} p.txt{margin-left: 15px; margin-right: 15px;}'
        html+='</style></head><body>'
        html+='<div id="logo"><img src="https://act-on-this-client-staging.herokuapp.com/static/media/act-on-this-logo.7c4b1177.png" alt="act on this logo" class="logo"></div>'
        html+='<p class="txt">Detected Issues: ' + _.join(combinedArray, ', ')+'</p>';
        html+='<p><a href="https://debug-politics.actonthis.org/" target="_blank"><img src="https://dl.dropboxusercontent.com/u/6673516/Screenshot%202017-01-15%2013.54.26.png" class="actimg"></a></p>';
        html+='</body></html>'
        res.send(html);
        // res.json({keys:combinedArray,url,title});
      }
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }

});

app.get('/article', async (req, res) => {
  try {
    let url:string = req.query.url;
    if (!url) {
      url = 'http://www.slate.com/articles/double_x/doublex/2015/12/rape_victims_are_still_being_charged_for_rape_kits.html';
    }

    console.log("Fetching URL", url);
    const alchemy_parameters = {
      extract: 'title,text,concepts,keywords,entities',
      sentiment: 1,
      maxRetrieve: 8,
      showSourceText: 1,
      url: url
    };

    alchemy_language.combined(alchemy_parameters, (err:string, response:any) => {
      if (err) {
        console.log('error:', err);
        res.sendStatus(404);
      } else {
        // console.log(JSON.stringify(response, null, 2));

        const title = response.title;
        // const text = response.text;
        const keywordArr = _.map(response.keywords,'text');
        const conceptsArr = _.map(response.concepts,'text');
        const entitiesArr = _.map(response.entities,'text')

        var combinedArray = _.concat(keywordArr,conceptsArr,entitiesArr);
        combinedArray = _.uniq(_.map(combinedArray, _.method('toLowerCase')));

        // console.log("Article Title:",title);
        // console.log("Article Text:",text);
        // console.log("Keywords:",keywordArr);
        // console.log("Concepts:",conceptsArr);
        // console.log("Entities:",entitiesArr);
        // console.log("All keywords:",combinedArray);
        res.json({keys:combinedArray,url,title});
      }
    });
  } catch (e) {
    console.log(e);
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

// AWS Health Check
app.use('/test', (_req, res) => {
  res.sendStatus(200);
})

interface OpenstatesPerson {
 id: string;
 full_name: string;
 party: string;
 district: string;
 state: string;
 chamber: string;
 offices: {
  phone: string;
 }[]
}

app.use('/openstates', async (req, res) => {
  const url = openstatesUrl + req.url;
  try {
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': '3c3cbd0d-c3e0-48eb-ad50-0cbd096a0bdd'
      }
    });
    const json: OpenstatesPerson[] = await response.json();
    res.json({
      callList: json.map(person => ({
        id: person.id,
        value: person.full_name,
        name: `${person.full_name}, ${person.party[0]} ${person.state.toUpperCase()}, ${person.chamber} chamber district ${person.district}`,
        number: person.offices.map(office => office.phone).join(', '),
        party: person.party,
      }))
    })
  } catch (e) {
    res.json({
      callList: [],
      error: e,
    })
  }
});

app.use('/', async (req, res) => {
  const url = sunlightUrl + req.url;
  const response = await fetch(url);
  const json = await response.json();
  const selectCongressPerson = (congressPerson: congress.CongressPerson) => {
    const repToString = (rep: congress.CongressPerson) => {
      const currentTerm = rep.terms[rep.terms.length - 1];
      return `${currentTerm.type === 'rep' ? 'Rep.' : 'Sen.'} ${rep.name.officialFull}, ${currentTerm.party[0]} ${currentTerm.state}`
    }

    return {
      id: congressPerson.id.thomas,
      value: repToString(congressPerson),
      name: congressPerson.name.officialFull,
      number: congressPerson.terms.slice(-1).pop().phone,
      party: congressPerson.terms.slice(-1).pop().party,
    };
  }

  if (json.results && json.results.length) {
    const state = json.results[0].state;
    const district = json.results[0].district;
    const representatives = congress.getRepresentatives(state, district);
    const senators = congress.getSenators(state);
    const callList = representatives.map(selectCongressPerson).concat(senators.map(selectCongressPerson));

    res.json({ state, district, representatives, senators, callList });
  } else {
    res.json({});
  }
});

app.use((err: any, _req: any, res: any) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
  console.warn('error', err)

  res.status(err.status).send(err);
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log(`listening on port ${port}`);
