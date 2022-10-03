/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const app = require('../app');
const supertest = require('supertest');

describe('Cute-name service', async () => {
  it('should have cute name response', async () => {
    // this.timeout(0) disable timeout for this test
    this.timeout(0);

    const response = await supertest(app)
      .get('/api/name')
      .expect('Content-Type', /html/)
      .expect(200);

    const isWordRegex = /^[a-zA-Z]+$/;
    assert.match('responsetextsplit', isWordRegex);
    assert.match(response.text.split(' ')[0], isWordRegex);
    assert.match(response.text.split(' ')[1], isWordRegex);
    assert.strictEqual(response.text.split(' ').length, 2);
  });
});
