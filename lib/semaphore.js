'use strict'

const utility = require('./utility.js')
const Queue = require('./queue.js')

class Semaphore {

  constructor(count) {
    if (!utility.isStrictPositiveInteger(count)) {
      throw new Error('Count must be an integer > 0, got ' + count)
    }
    this._count = count
    this._ceiling = count
    this._resolveIdle = () => {}
    this._tasks = new Queue()
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

  async onIdle() {
    if (this._count === this._ceiling && this._tasks.isEmpty) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const previousResolve = this._resolveIdle
			this._resolveIdle = () => {
				previousResolve()
				resolve()
			}
    })
  }
}

function signalIdle(semaphore) {
  semaphore._resolveIdle()
  semaphore._resolveIdle = () => {}
}

function acquire(semaphore) {
  return new Promise((resolve, reject) => {
    const task = () => {
      const release = () => {
        semaphore._count += 1
        runNext(semaphore)
      }
      resolve(release)
    }
    semaphore._tasks.offer(task)
    process.nextTick(() => runNext(semaphore))
  })
}

function runNext(semaphore) {
  if (semaphore._count > 0 && !semaphore._tasks.isEmpty) {
    semaphore._count -= 1
    const next = semaphore._tasks.poll()
    next()
  }
  if (semaphore._count === semaphore._ceiling && semaphore._tasks.isEmpty) {
    signalIdle(semaphore)
  }
}

module.exports = Semaphore
