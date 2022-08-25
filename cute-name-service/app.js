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
'use strict';

const { promisify } = require('util');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const generator = require('project-name-generator');

const app = express();

const setTmeoutPromise = promisify(setTimeout);

// Add basic health-check endpoints
app.use('/ready', (request, response) => {
  return response.sendStatus(200);
});

app.use('/live', (request, response) => {
  return response.sendStatus(200);
});

// Send and receive json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS support
app.use(cors());

// Name service API
app.get('/api/name', async (request, response) => {
  // Simulate a long response
  await setTmeoutPromise(2000);
  response.send(generator().spaced);
});

module.exports = app;
