/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const supertest = require('supertest');

describe('Cute-name service', () => {
  it('should have cute name response', async function () {
    this.timeout(0);
    const app = proxyquire('../app', {
      'project-name-generator': () => {
        return {
          spaced: 'cute-name'
        };
      }
    });
    const response = await supertest(app)
      .get('/api/name')
      .expect('Content-Type', /html/)
      .expect(200);

    assert.strictEqual(response.text, 'cute-name');
  });
});
