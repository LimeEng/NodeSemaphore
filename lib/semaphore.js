'use strict'

class Semaphore {

  constructor(count) {
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

async function acquire(semaphore) {
 // TODO
}

function isFunction(value) {
  return typeof value === 'function'
}

module.exports = Semaphore
