'use strict'

const assert = require('assert').strict
const testing = require('./test-utility.js')
const Queue = require('../lib/queue.js')

describe('Queue', function () {
  describe('constructor', function () {
    it('should be empty when instantiated', function () {
      const queue = new Queue()
      assert.deepStrictEqual(queue.size, 0)
      assert.deepStrictEqual(queue.isEmpty, true)
    })
  })

  describe('.offer(...values)', function () {
    it('should update size and isEmpty', function () {
      const queue = new Queue()
      queue.offer(1, 2, 3, 4, 5)
      assert.deepStrictEqual(queue.size, 5)
      assert.deepStrictEqual(queue.isEmpty, false)
    })

    it('should not break down arrays', function () {
      const queue = new Queue()
      const data = [1, 2, 3]
      queue.offer(data, 4, 5, 6)
      assert.deepStrictEqual(queue.size, 4)
      assert.deepStrictEqual(queue.isEmpty, false)
      assert.deepStrictEqual(queue.peek(), data)
    })

    it('should throw an error if offered null', function () {
      const queue = new Queue()
      const errorThrown = testing.shouldThrow(() => queue.offer(1, 2, 3, null, 4, 5, 6))
      assert.deepStrictEqual(errorThrown, true)
    })

    it('should throw an error if offered undefined', function () {
      const queue = new Queue()
      const errorThrown = testing.shouldThrow(() => queue.offer(1, 2, 3, undefined, 4, 5, 6))
      assert.deepStrictEqual(errorThrown, true)
    })

    it('should add items in the correct order', function () {
      const queue = new Queue()
      const data = testing.zeroTo(10)
      queue.offer(...data)
      assert.deepStrictEqual(queue.size, 10)
      assert.deepStrictEqual(queue.isEmpty, false)

      const polled = data.map(item => queue.poll())

      assert.deepStrictEqual(polled, data)
    })
  })

  describe('.offer(value)', function () {
    it('should update size and isEmpty', function () {
      const queue = new Queue()
      for (let i = 1; i < 10; i++) {
        queue.offer(i)
        assert.deepStrictEqual(queue.size, i)
        assert.deepStrictEqual(queue.isEmpty, false)
      }
    })

    it('should not break down arrays', function () {
      const queue = new Queue()
      const data = [1, 2, 3, 4, 5]
      queue.offer(data)
      assert.deepStrictEqual(queue.size, 1)
      assert.deepStrictEqual(queue.isEmpty, false)
      assert.deepStrictEqual(queue.peek(), data)
    })

    it('should throw an error if offered null', function () {
      const queue = new Queue()
      const errorThrown = testing.shouldThrow(() => queue.offer(null))
      assert.deepStrictEqual(errorThrown, true)
    })

    it('should throw an error if offered undefined', function () {
      const queue = new Queue()
      const errorThrown = testing.shouldThrow(() => queue.offer(undefined))
      assert.deepStrictEqual(errorThrown, true)
    })
  })

  describe('.poll()', function () {
    it('should return undefined if called on an empty queue', function () {
      const queue = new Queue()
      assert.deepStrictEqual(queue.poll(), undefined)
    })

    it('should return the right element and remove it', function () {
      const queue = new Queue()
      queue.offer(1)
      queue.offer(2)
      queue.offer(3)
      assert.deepStrictEqual(queue.size, 3)
      assert.deepStrictEqual(queue.isEmpty, false)
      assert.deepStrictEqual(queue.poll(), 1)
      assert.deepStrictEqual(queue.size, 2)
      assert.deepStrictEqual(queue.isEmpty, false)
    })

    it('should empty the queue when called enough times', function () {
      const queue = new Queue()
      for (let i = 0; i < 10; i++) {
        queue.offer(i)
      }
      for (let i = 0; i < 10; i++) {
        assert.deepStrictEqual(queue.poll(), i)
      }
      assert.deepStrictEqual(queue.poll(), undefined)
      assert.deepStrictEqual(queue.size, 0)
      assert.deepStrictEqual(queue.isEmpty, true)
    })
  })

  describe('.peek()', function () {
    it('should return undefined if called on an empty queue', function () {
      const queue = new Queue()
      assert.deepStrictEqual(queue.peek(), undefined)
    })

    it('should return the right element, but not remove it', function () {
      const queue = new Queue()
      queue.offer(1)
      queue.offer(2)
      queue.offer(3)
      assert.deepStrictEqual(queue.size, 3)
      assert.deepStrictEqual(queue.isEmpty, false)
      assert.deepStrictEqual(queue.peek(), 1)
      assert.deepStrictEqual(queue.size, 3)
      assert.deepStrictEqual(queue.isEmpty, false)
    })
  })

  describe('.clear()', function () {
    it('should clear the queue', function () {
      const queue = new Queue()
      for (let i = 0; i < 10; i++) {
        queue.offer(i)
      }
      assert.deepStrictEqual(queue.size, 10)
      assert.deepStrictEqual(queue.isEmpty, false)
      queue.clear()
      assert.deepStrictEqual(queue.size, 0)
      assert.deepStrictEqual(queue.isEmpty, true)
      assert.deepStrictEqual(queue.peek(), undefined)
    })
  })
})
