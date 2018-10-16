'use strict'

const assert = require('assert').strict
const utility = require('../lib/utility.js')

describe('Utility', function () {
  describe('isFunction(value)', function () {
    const isFunction = utility.isFunction
    it('should correctly detect functions', function () {
      assert.ok(isFunction(function named() { }))
      assert.ok(isFunction(() => { }))
      assert.ok(isFunction(Date))
      assert.ok(isFunction(String))
      assert.ok(isFunction(Object))
    })
    it('should correctly return false', function () {
      assert.ok(!isFunction(undefined))
      assert.ok(!isFunction(null))
      assert.ok(!isFunction(1))
      assert.ok(!isFunction(0))
      assert.ok(!isFunction(-1))
      assert.ok(!isFunction(0.9999999))
      assert.ok(!isFunction(Number.NaN))
      assert.ok(!isFunction(Number.POSITIVE_INFINITY))
      assert.ok(!isFunction(Number.NEGATIVE_INFINITY))
      assert.ok(!isFunction([]))
      assert.ok(!isFunction([1]))
      assert.ok(!isFunction([1, 2, 3]))
      assert.ok(!isFunction([() => 1 + 1]))
      assert.ok(!isFunction({}))
      assert.ok(!isFunction({ prop: 'Hello World!' }))
    })
  })
  describe('isInteger(value)', function () {
    const isInteger = utility.isInteger
    it('should correctly detect integers', function () {
      // TODO
      this.skip()
    })
    it('should correctly return false', function () {
      // TODO
      this.skip()
    })
  })
  describe('isStrictPositiveInteger(value)', function () {
    const isStrictPositiveInteger = utility.isStrictPositiveInteger
    it('should correctly detect strictly positive integers (> 0)', function () {
      // TODO
      this.skip()
    })
    it('should correctly return false', function () {
      // TODO
      this.skip()
    })
  })
})