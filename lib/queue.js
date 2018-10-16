'use strict'

class Queue {

  constructor() {
    this.contents = []
  }

  offer(value) {
    if (value === null) {
      throw new Error('Null values are not allowed')
    }
    this.contents.push(value)
  }

  poll() {
    if (this.isEmpty) {
      return null
    }
    // TODO: O(n) performance, replace array with a FIFO-queue
    return this.contents.shift()
  }

  peek() {
    if (this.isEmpty) {
      return null
    }
    return this.contents[0]
  }

  clear() {
    this.contents = []
  }

  get size() {
    return this.contents.length
  }

  get isEmpty() {
    return this.size === 0
  }
}

module.exports = Queue
