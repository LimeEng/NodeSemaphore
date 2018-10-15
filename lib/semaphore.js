'use strict'

class Semaphore {

  constructor(count) {
    this.count = count
    this.tasks = []
  }

  async lock(thunk) {
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

module.exports = Semaphore
