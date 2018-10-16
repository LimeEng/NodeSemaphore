'use strict'

const assert = require('assert').strict
const Queue = require('../lib/queue.js')

describe('Queue', function () {
  describe('constructor', function () {
    it('should be empty when instantiated', function () {
      const queue = new Queue()
      assert.deepEqual(0, queue.size)
      assert.deepEqual(true, queue.isEmpty)
    })
  })
  describe('.offer(value)', function () {
    it('should update size and isEmpty', function () {
      const queue = new Queue()
      for (let i = 1; i < 10; i++) {
        queue.offer(i)
        assert.deepEqual(i, queue.size)
        assert.deepEqual(false, queue.isEmpty)
      }
    })
    it('should not break down arrays', function () {
      const queue = new Queue()
      const data = [1, 2, 3, 4, 5]
      queue.offer(data)
      assert.deepEqual(1, queue.size)
      assert.deepEqual(false, queue.isEmpty)
      assert.deepEqual(data, queue.peek())
    })
    it('should throw an error if offered null', function () {
      const queue = new Queue()
      try {
        queue.offer(null)
        assert.fail()
      } catch (err) { }
    })
  })
  describe('.poll()', function () {
    it('should return null if called on an empty queue', function () {
      const queue = new Queue()
      assert.deepEqual(null, queue.poll())
    })
    it('should return the right element and remove it', function () {
      const queue = new Queue()
      queue.offer(1)
      queue.offer(2)
      queue.offer(3)
      assert.deepEqual(3, queue.size)
      assert.deepEqual(false, queue.isEmpty)
      assert.deepEqual(1, queue.poll())
      assert.deepEqual(2, queue.size)
      assert.deepEqual(false, queue.isEmpty)
    })
    it('should empty the queue when called enough times', function () {
      const queue = new Queue()
      for (let i = 0; i < 10; i++) {
        queue.offer(i)
      }
      for (let i = 0; i < 10; i++) {
        assert.deepEqual(i, queue.poll())
      }
      assert.deepEqual(null, queue.poll())
      assert.deepEqual(0, queue.size)
      assert.deepEqual(true, queue.isEmpty)
    })
  })
  describe('.peek()', function () {
    it('should return null if called on an empty queue', function () {
      const queue = new Queue()
      assert.deepEqual(null, queue.peek())
    })
    it('should return the right element, but not remove it', function () {
      const queue = new Queue()
      queue.offer(1)
      queue.offer(2)
      queue.offer(3)
      assert.deepEqual(3, queue.size)
      assert.deepEqual(false, queue.isEmpty)
      assert.deepEqual(1, queue.peek())
      assert.deepEqual(3, queue.size)
      assert.deepEqual(false, queue.isEmpty)
    })
  })
  describe('.clear()', function () {
    it('should clear the queue', function () {
      const queue = new Queue()
      for (let i = 0; i < 10; i++) {
        queue.offer(i)
      }
      assert.deepEqual(10, queue.size)
      assert.deepEqual(false, queue.isEmpty)
      queue.clear()
      assert.deepEqual(0, queue.size)
      assert.deepEqual(true, queue.isEmpty)
    })
  })
})
