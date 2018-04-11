'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const probe = require('kube-probe');
const infinispan = require('infinispan');
const nameService = require('./lib/name-service-client');

const app = express();
// Adds basic health-check endpoints
probe(app);

const nameServiceHost = process.env.NAME_SERVICE_HOST || 'http://nodejs-cache-cute-name:8080';

const cacheClientOptions = {
  port: process.env.CACHE_PORT || 11222,
  host: process.env.CACHE_HOST || 'cache-server'
};

const infinispanConnection = infinispan.client(cacheClientOptions);
const cacheKey = 'cute-name';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, 'public')));
// Expose the license.html at http[s]://[host]:[port]/licences/licenses.html
app.use('/licenses', express.static(path.join(__dirname, 'licenses')));

async function getCached (client) {
  return client.get(cacheKey);
}

app.use('/api/greeting', async (request, response) => {
  const client = await infinispanConnection;
  try {
    const cached = await getCached(client);
    if (!cached) {
      const projectName = await nameService(`${nameServiceHost}/api/name`);
      client.put(cacheKey, projectName, {lifespan: '5s'});
      return response.send({message: projectName});
    }
    return response.send({message: cached});
  } catch (err) {
    response.status(400);
    return response.send(err);
  }
});

// Get the status of the cache
app.get('/api/cached', async (request, response) => {
  try {
    const client = await infinispanConnection;
    const cache = await getCached(client);
    return response.send({cached: cache});
  } catch (err) {
    response.status(400);
    response.send(err);
  }
});

// Clear the cachce
app.delete('/api/cached', async (request, response) => {
  try {
    const client = await infinispanConnection;
    await client.remove(cacheKey);
    return response.sendStatus(204);
  } catch (err) {
    response.status(400);
    response.send(err);
  }
});

module.exports = app;
