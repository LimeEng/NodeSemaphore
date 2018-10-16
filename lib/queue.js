'use strict'

class Queue {

  constructor() {
    this.contents = []
  }

  offer(value) {

  }

  poll() {

  }

  peek() {

  }

  clear() {

  }

  get size() {
    return this.contents.length
  }

  get isEmpty() {
    return this.size === 0
  }
}

module.exports = Queue
