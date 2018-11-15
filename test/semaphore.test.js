'use strict'

const assert = require('assert').strict
const testing = require('./test-utility.js')
const Semaphore = require('../lib/semaphore.js')

describe('Semaphore', function () {
  describe('constructor', function () {
    it('should throw error if count is not an integer > 0', function () {
      function shouldThrow(argument) {
        return testing.shouldThrow(() => new Semaphore(argument))
      }
      for (let i = -100; i <= 0; i++) {
        assert.ok(shouldThrow(i))
      }
      assert.ok(shouldThrow('Hello World!'))
      assert.ok(shouldThrow(''))
      assert.ok(shouldThrow(0))
      assert.ok(shouldThrow(-1))
      assert.ok(shouldThrow(3.1))
      assert.ok(shouldThrow(Number.NaN))
      assert.ok(shouldThrow(Number.POSITIVE_INFINITY))
      assert.ok(shouldThrow(Number.NEGATIVE_INFINITY))
      assert.ok(shouldThrow(Number.MAX_SAFE_INTEGER + 1))
      assert.ok(shouldThrow(Number.MIN_SAFE_INTEGER))
      assert.ok(shouldThrow([]))
      assert.ok(shouldThrow([1]))
      assert.ok(shouldThrow([1, 2, 3]))
      assert.ok(shouldThrow({}))
      assert.ok(shouldThrow({ prop: 'Hello there!' }))
      assert.ok(shouldThrow({ 1: 2 }))
    })

    it('should not throw an error if count is an integer > 0', function () {
      function shouldNotThrow(argument) {
        return testing.shouldNotThrow(() => new Semaphore(argument))
      }
      for (let i = 1; i <= 100; i++) {
        assert.ok(shouldNotThrow(i))
      }
      assert.ok(shouldNotThrow(Number.MAX_SAFE_INTEGER))
    })
  })

  describe('.lock(thunk)', function () {
    it('should limit concurrent actions', async function () {
      const sem = new Semaphore(2)

      let running = 0
      let finished = 0
      const numberOfTasks = 10

      const task = async () => {
        // At most one function could be running right now,
        // and then this function is registered as "running"
        assert(running <= 1)
        running++
        await testing.wait(10)
        // At most two functions could be running right now
        assert(running <= 2)
        running--
        assert(running <= 1)
        finished++
      }

      const runningTasks = testing.zeroTo(numberOfTasks).map(i => sem.lock(() => task()))

      await Promise.all(runningTasks)
      assert.deepStrictEqual(finished, numberOfTasks)
    })

    it('should throw exception when task throws', async function () {
      const sem = new Semaphore(2)

      const task = async (shouldThrow) => {
        await testing.wait(10)
        if (shouldThrow) {
          throw new Error('Boom!')
        }
      }

      let r1 = sem.lock(() => task(true))
      let r2 = sem.lock(() => task(false))
      let r3 = sem.lock(() => task(true))

      r1 = r1.then(() => assert.fail())
        .catch(() => {/* Success!*/ })
      r2 = r2.then(() => {/* Success!*/ })
        .catch(() => assert.fail())
      r3 = r3.then(() => assert.fail())
        .catch(() => {/* Success!*/ })

      await Promise.all([r1, r2, r3])
    })

    it('should return value from thunk', async function () {
      const sem = new Semaphore(2)

      const testValue = 'Hello World!'

      const task = async () => {
        await testing.wait(10)
        return testValue
      }

      const runningTasks = testing.zeroTo(5).map(i => sem.lock(() => task()))
      const results = await Promise.all(runningTasks)
      const result = results.every(item => item === testValue)
      assert(result)
    })

    it('should throw error with non-function arguments', async function () {
      const sem = new Semaphore(2)

      function shouldThrow(argument) {
        return testing.shouldThrowAsync(() => sem.lock(argument))
      }

      assert.ok(shouldThrow('Hello World!'))
      assert.ok(shouldThrow(10))
      assert.ok(shouldThrow(0))
      assert.ok(shouldThrow([]))
      assert.ok(shouldThrow([1, 2, 3]))
      assert.ok(shouldThrow({}))
      assert.ok(shouldThrow({ prop: 'Hello there!' }))
    })
  })

  describe('.onEmpty()', function () {
    it('should resolve when queue is empty', async function () {
      const sem = new Semaphore(2)

      async function task() {
        await testing.wait(10)
        return 'From task'
      }

      const runningTasks = testing.zeroTo(20).map(() => sem.lock(() => task()))
      const onEmptyPromise = sem.onEmpty()

      const result = await Promise.race([Promise.all(runningTasks), onEmptyPromise])
      assert.deepStrictEqual(result, 'From task')

      return onEmptyPromise
    })

    it('should not reject if all promises in the queue reject', async function () {
      const sem = new Semaphore(2)

      async function task() {
        await testing.wait(10)
        throw new Error('From task')
      }

      async function waitThenReject(promises) {
        await Promise.all(promises.map(promise => promise.catch(e => e)))
        console.log('Hello there!')
        return Promise.reject('All tasks rejected!')
      }

      const runningTasks = testing.zeroTo(20).map(() => sem.lock(() => task()))
      const onEmptyPromise = sem.onEmpty()

      const raced = Promise.race([waitThenReject(runningTasks), onEmptyPromise])
        .then(() => {
          // Promise did not reject => onEmptyPromise finished prematurely
          return Promise.reject()
        }, () => {
          // Promise did reject => onEmptyPromise did not finish prematurely
          return Promise.resolve
        })

      return Promise.all([raced, onEmptyPromise])
    })
  })
})
