'use strict'

const assert = require('assert').strict
const Semaphore = require('../lib/semaphore.js')

describe('semaphore', function () {
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
      await wait(10)
      // At most two functions could be running right now
      assert(running <= 2)
      running--
      assert(running <= 1)
      finished++
    }

    const runningTasks = array(numberOfTasks).map(i => sem.lock(() => task()))

    await Promise.all(runningTasks)
    assert.equal(finished, numberOfTasks)
  })

  it('should throw exception when task throws', async function () {
    const sem = new Semaphore(2)

    const task = async (shouldThrow) => {
      await wait(10)
      if (shouldThrow) {
        throw new Error('Boom!')
      }
    }

    const r1 = sem.lock(() => task(true))
    const r2 = sem.lock(() => task(false))
    const r3 = sem.lock(() => task(true))

    r1.then(() => assert.fail())
      .catch(() => assert.ok())
    r2.then(() => assert.ok())
      .catch(() => assert.fail())
    r3.then(() => assert.fail())
      .catch(() => assert.ok())
  })

  it('should return value from thunk', async function () {
    const sem = new Semaphore(2)

    const testValue = 'Hello World!'

    const task = async () => {
      await wait(10)
      return testValue
    }

    const runningTasks = array(5).map(i => sem.lock(() => task()))
    const results = await Promise.all(runningTasks)
    const result = results.every(item => item === testValue)
    assert(result)
  })
})

function array(bound) {
  return [...Array(bound).keys()]
}

function wait(delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay))
}
