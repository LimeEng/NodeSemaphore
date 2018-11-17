'use strict'

const utility = require('./utility.js')
const Queue = require('./queue.js')

class Semaphore {

  constructor(count) {
    if (!utility.isStrictPositiveInteger(count)) {
      throw new Error('Count must be an integer > 0, got ' + count)
    }
    this.count = count
    this.originalCount = count
    this.resolveIdle = () => {}
    this.tasks = new Queue()
  }

  async lock(thunk) {
    if (!utility.isFunction(thunk)) {
      throw new Error('Only functions are accepted')
    }
    const release = await acquire(this)
    try {
      const result = await thunk()
      release()
      return result
    } catch (err) {
      release()
      throw err
    }
  }

  async onEmpty() {
    if (this.count === this.originalCount && this.tasks.size === 0) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const previousResolve = this.resolveIdle
			this.resolveIdle = () => {
				previousResolve()
				resolve()
			};
    })
  }
}

function signalEmpty(semaphore) {
  semaphore.resolveIdle()
  semaphore.resolveIdle = () => {}
}

function acquire(semaphore) {
  return new Promise((resolve, reject) => {
    const task = () => {
      const release = () => {
        semaphore.count++
        runNext(semaphore)
      }
      resolve(release)
    }
    semaphore.tasks.offer(task)
    process.nextTick(() => runNext(semaphore))
  })
}

function runNext(semaphore) {
  if (semaphore.count > 0 && !semaphore.tasks.isEmpty) {
    semaphore.count--
    const next = semaphore.tasks.poll()
    next()
  }
  if (semaphore.count === semaphore.originalCount && semaphore.tasks.isEmpty) {
    signalEmpty(semaphore)
  }
}

module.exports = Semaphore
