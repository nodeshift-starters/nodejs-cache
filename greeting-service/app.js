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

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const probe = require('kube-probe');

const app = express();
// adds basic health-check endpoints
probe(app);

const nameService = require('./lib/name-service-client');
const nameServiceHost = process.env.NAME_SERVICE_HOST || 'http://nodejs-cache-cute-name:8080';

const infinispan = require('infinispan');

const cacheClientOptions = {
  port: process.env.CACHE_PORT || 11222,
  host: process.env.CACHE_HOST || 'cache-server'
};

const infinispanConnection = infinispan.client(cacheClientOptions);
const cacheKey = 'cute-name';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'public')));
// expose the license.html at http[s]://[host]:[port]/licences/licenses.html
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

// get the status of the cache
app.get('/api/cached', async (request, response) => {
  try {
    const client = await infinispanConnection;
    const cache = await getCached(client);
    return response.send({cached: cache ? true : false});
  } catch (err) {
    response.status(400);
    response.send(err);
  }
});

// clear the cachce
app.delete('/api/cached', async (request, response) => {
  try {
    const client = await infinispanConnection;
    await client.remove(cacheKey);
    return response.send(204);
  } catch (err) {
    response.status(400);
    response.send(err);
  }
});

module.exports = app;
