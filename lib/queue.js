'use strict'

const FifoQueue = require('@limeeng/fifo-queue')

class Queue {

  constructor() {
    this.contents = new FifoQueue()
  }

  offer(...values) {
    if (values.includes(null)) {
      throw new Error('Null values are not permitted')
    }
    values.forEach(value => this.contents.offer(value))
  }

  poll() {
    return this.contents.poll()
  }

  peek() {
    return this.contents.peek()
  }

  clear() {
    this.contents.clear()
  }

  get size() {
    return this.contents.size
  }

  get isEmpty() {
    return this.contents.isEmpty
  }
}

module.exports = Queue
