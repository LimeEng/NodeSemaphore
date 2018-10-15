'use strict'

class Semaphore {

  constructor(count) {
    this.count = count
    this.tasks = []
  }

  async lock(thunk) {
    return thunk()
  }
}

module.exports = Semaphore
