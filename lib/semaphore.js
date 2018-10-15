'use strict'

class Semaphore {

  constructor(count) {
    if (!isStrictPositiveInteger(count)) {
      throw new Error('Count must be an integer > 0, got ' + count)
    }
    this.count = count
    this.tasks = []
  }

  async lock(thunk) {
    if (!isFunction(thunk)) {
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
    semaphore.tasks.push(task)
    process.nextTick(() => runNext(semaphore))
  })
}

function runNext(semaphore) {
  if (semaphore.count > 0 && semaphore.tasks.length > 0) {
    semaphore.count--
    // TODO: O(n) performance, replace array with a FIFO-queue
    const next = semaphore.tasks.shift()
    next()
  }
}

function isFunction(value) {
  return typeof value === 'function'
}

function isInteger(value) {
 return Number.isSafeInteger(value)
}

function isStrictPositiveInteger(value) {
  return isInteger(value) && value > 0
}

module.exports = Semaphore
