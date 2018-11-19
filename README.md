[![Build Status](https://travis-ci.com/LimeEng/NodeSemaphore.svg?branch=master)](https://travis-ci.com/LimeEng/NodeSemaphore)
[![npm (scoped)](https://img.shields.io/npm/v/@limeeng/semaphore.svg)](https://www.npmjs.com/package/@limeeng/semaphore)

# Node Semaphore

What is a semaphore? A great explanation is available at [Wikipedia](https://en.wikipedia.org/wiki/Semaphore_(programming)).
It is basically a simple way to control access to resources in concurrent systems. One might think that there is no need for semaphores in JavaScript since it is single-threaded by nature, but that would be wrong. Race conditions can still manifest and there are several legitimate reasons for wanting to throttle concurrency with asynchronous actions.

- [Sample Code](#sample-code)
  - [API](#api)
  - [Examples](#examples)

# Sample Code

## API

### new Semaphore(count)
**count: integer number > 0**

Creates a new Semaphore with the given integer count.

```js
const Semaphore = require('@limeeng/semaphore')

const sem = new Semaphore(16)
```

### semaphore.lock(thunk)
**thunk: () => Promise**

Accepts a thunk and returns a promise. The promise will resolve with the return value of the thunk if no errors were thrown, otherwise the promise will reject. Since there is a limited amount of resources (specified by count in the constructor) this thunk might not execute immediately. If maximum concurrency is reached (within the context of the semaphore) the thunk will be placed in a queue and wait until it can execute.

```js
const Semaphore = require('@limeeng/semaphore')

const sem = new Semaphore(2)

sem.lock(() => sharedResource())

function sharedResource() {
  // ...
  return promise
}
```

### semaphore.onIdle()

Returns a promise that resolves when all tasks submitted to the semaphore has completed. Can be called multiple times and it is possible to add more tasks after a call to this function.

```js
const Semaphore = require('@limeeng/semaphore')

const sem = new Semaphore(2)

sem.lock(() => console.log('#1'))
sem.lock(() => console.log('#2'))

sem.onIdle().then(() => console.log('Done! #5'))

sem.lock(() => console.log('#3'))
sem.lock(() => console.log('#4'))
```

## Examples

This will create a version of `got` with concurrency set to 16. That is, no more than 16 requests will be in flight at any given time.

```js
const Semaphore = require('@limeeng/semaphore')

const sem = new Semaphore(16)

function politeGot(url) {
  return sem.lock(() => got(url))
}
```
