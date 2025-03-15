![](https://github.com/LimeEng/NodeSemaphore/actions/workflows/ci.yaml/badge.svg)
[![npm (scoped)](https://img.shields.io/npm/v/@limeeng/semaphore.svg)](https://www.npmjs.com/package/@limeeng/semaphore)

# Node Semaphore

[Semaphores](https://en.wikipedia.org/wiki/Semaphore_(programming)) can be used to control access to resources in concurrent systems. While JavaScript is inherently single-threaded, semaphores can still help manage asynchronous operations and prevent issues like resource contention.

- [Installation](#install)
- [API](#api)
- [Examples](#examples)

# Install

```
npm install --save @limeeng/semaphore
```

# API

## new Semaphore(count)

**count:** `number`
  - Must be an integer > 0

Creates a new Semaphore with the given integer count.

```js
const Semaphore = require('@limeeng/semaphore')

const sem = new Semaphore(4)
```

## semaphore.lock(thunk)

**thunk:** `Function`

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

## semaphore.onIdle()

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

# Examples

This will create a version of `got` with concurrency set to 4. That is, no more than 4 requests will be in flight at any given time.

```js
const Semaphore = require('@limeeng/semaphore')
const got = require('got')

const sem = new Semaphore(4)

function politeGot(url) {
  return sem.lock(() => got(url))
}
```
