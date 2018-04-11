'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const supertest = require('supertest');

test('cute-name-service test', t => {
  const app = proxyquire('../app', {
    'project-name-generator': () => {
      return {
        spaced: 'cute-name'
      };
    }
  });

  supertest(app)
    .get('/api/name')
    .expect('Content-Type', /html/)
    .expect(200)
    .then(response => {
      t.equal(response.text, 'cute-name', 'shold have a cute name response');
    })
    .then(() => {
      t.end();
    });
});
