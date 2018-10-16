'use strict'

const utility = require('./utility.js')
const Queue = require('./queue.js')

class Semaphore {

  constructor(count) {
    if (!utility.isStrictPositiveInteger(count)) {
      throw new Error('Count must be an integer > 0, got ' + count)
    }
    this.count = count
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
}

module.exports = Semaphore
