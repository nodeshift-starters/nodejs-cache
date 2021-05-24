/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const supertest = require('supertest');

describe('Greeting service', () => {
  it('nothing cached', async () => {
    const app = proxyquire('../app', {
      infinispan: {
        client: () => {
          return Promise.resolve({
            get: key => {
              assert.strictEqual(key, 'cute-name');
              return Promise.resolve();
            },
            put: (key, name, options) => {
              assert.strictEqual(key, 'cute-name');
              assert.strictEqual(name, 'cool-project-name');
              assert.strictEqual(options.lifespan, '5s');
              return Promise.resolve();
            }
          });
        }
      },
      './lib/name-service-client': () => {
        return Promise.resolve('cool-project-name');
      }
    });
    const { body } = await supertest(app)
      .get('/api/greeting')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.strictEqual(body.message, 'cool-project-name');
  });

  it('cached', async () => {
    const app = proxyquire('../app', {
      infinispan: {
        client: () => {
          return Promise.resolve({
            get: key => {
              assert.strictEqual(key, 'cute-name');
              return Promise.resolve('cool-project-name');
            },
            put: () => {
              return Promise.resolve();
            }
          });
        }
      },
      './lib/name-service-client': () => {
        assert.fail('should not call this function this run');
      }
    });
    const { body } = await supertest(app)
      .get('/api/greeting')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.strictEqual(body.message, 'cool-project-name');
  });

  it('check cache', async () => {
    const app = proxyquire('../app', {
      infinispan: {
        client: () => {
          return Promise.resolve({
            get: key => {
              assert.strictEqual(key, 'cute-name');
              return Promise.resolve('cool-project-name');
            },
            put: () => {
              return Promise.resolve();
            }
          });
        }
      }
    });

    const { body } = await supertest(app)
      .get('/api/cached')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.strictEqual(body.cached, 'cool-project-name');
  });

  it('delete cache', async () => {
    const app = proxyquire('../app', {
      infinispan: {
        client: () => {
          return Promise.resolve({
            remove: key => {
              assert.strictEqual(key, 'cute-name');
              return Promise.resolve();
            }
          });
        }
      }
    });

    const response = await supertest(app)
      .delete('/api/cached')
      .expect(204);

    assert.strictEqual(response.statusCode, 204);
  });
});
