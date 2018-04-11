'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const supertest = require('supertest');

test('greeting service test - nothing cached', t => {
  const app = proxyquire('../app', {
    infinispan: {
      client: () => {
        return Promise.resolve({
          get: key => {
            t.equal(key, 'cute-name', 'cache key is cute-name');
            return Promise.resolve();
          },
          put: (key, name, options) => {
            t.equal(key, 'cute-name', 'cache key is cute-name');
            t.equal(name, 'cool-project-name', 'has the project name');
            t.equal(options.lifespan, '5s', 'lifespan prop ');
            return Promise.resolve();
          }
        });
      }
    },
    './lib/name-service-client': () => {
      return Promise.resolve('cool-project-name');
    }
  });

  supertest(app)
    .get('/api/greeting')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      t.equal(response.body.message, 'cool-project-name', 'returned a message');
      t.end();
    });
});

test('greeting service test - cached', t => {
  const app = proxyquire('../app', {
    infinispan: {
      client: () => {
        return Promise.resolve({
          get: key => {
            t.equal(key, 'cute-name', 'cache key is cute-name');
            return Promise.resolve('cool-project-name');
          },
          put: () => {
            return Promise.resolve();
          }
        });
      }
    },
    './lib/name-service-client': () => {
      t.fail('should not call this function this run');
    }
  });

  supertest(app)
    .get('/api/greeting')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      t.equal(response.body.message, 'cool-project-name', 'returned a message');
      t.end();
    });
});

// Reset Cache
test('greeting service test - check cache', t => {
  const app = proxyquire('../app', {
    infinispan: {
      client: () => {
        return Promise.resolve({
          get: key => {
            t.equal(key, 'cute-name', 'cache key is cute-name');
            return Promise.resolve('cool-project-name');
          },
          put: () => {
            return Promise.resolve();
          }
        });
      }
    }
  });

  supertest(app)
    .get('/api/cached')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      t.equal(response.body.cached, 'cool-project-name', 'returned a cache');
      t.end();
    });
});

// Delete Cache
test('greeting service test - delete cache', t => {
  const app = proxyquire('../app', {
    infinispan: {
      client: () => {
        return Promise.resolve({
          remove: key => {
            t.equal(key, 'cute-name', 'cache key is cute-name');
            return Promise.resolve();
          }
        });
      }
    }
  });

  supertest(app)
    .delete('/api/cached')
    .expect(204)
    .then(_ => {
      t.pass('should return as a 204');
      t.end();
    });
});
