/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const app = require('../app');
const supertest = require('supertest');

describe('Cute-name service', async () => {
  it('should have cute name response', async () => {
    const response = await supertest(app)
      .get('/api/name')
      .expect('Content-Type', /html/)
      .expect(200);

    const isWordRegex = /^[a-zA-Z]+$/;
    assert.match('responsetextsplit', isWordRegex);
    assert.match(response.text.split(' ')[0], isWordRegex);
    assert.match(response.text.split(' ')[1], isWordRegex);
    assert.strictEqual(response.text.split(' ').length, 2);
  }).timeout(5000);
});

describe('ready endpoint', () => {
  it('should responde with OK message', async () => {
    const response = await supertest(app)
      .get('/ready')
      .expect('Content-Type', /text\/plain/)
      .expect(200);

    assert.match(response.text, /OK/);
  });
});

describe('live endpoint', () => {
  it('should responde with OK message', async () => {
    const response = await supertest(app)
      .get('/ready')
      .expect('Content-Type', /text\/plain/)
      .expect(200);

    console.log(response.text);
    assert.match(response.text, /OK/);
  });
});
