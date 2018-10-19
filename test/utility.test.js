'use strict'

const assert = require('assert').strict
const utility = require('../lib/utility.js')

describe('Utility', function () {
  describe('.isFunction(value)', function () {
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

  describe('.isInteger(value)', function () {
    const isInteger = utility.isInteger
    it('should correctly detect integers', function () {
      for (let i = -100; i <= 100; i++) {
        assert.ok(isInteger(i))
      }
      assert.ok(isInteger(Number.MAX_SAFE_INTEGER))
      assert.ok(isInteger(Number.MIN_SAFE_INTEGER))
    })

    it('should correctly return false', function () {
      assert.ok(!isInteger(0.9999999999999))
      assert.ok(!isInteger(0.0000000000001))
      assert.ok(!isInteger(Number.NaN))
      assert.ok(!isInteger(Number.POSITIVE_INFINITY))
      assert.ok(!isInteger(Number.NEGATIVE_INFINITY))
      assert.ok(!isInteger(Number.MAX_VALUE))
      assert.ok(!isInteger(Number.MIN_VALUE))
      assert.ok(!isInteger([]))
      assert.ok(!isInteger([1]))
      assert.ok(!isInteger([1, 2, 3]))
      assert.ok(!isInteger({}))
      assert.ok(!isInteger({ 1: 2 }))
      assert.ok(!isInteger(() => { 1 + 1 }))
    })
  })

  describe('.isStrictPositiveInteger(value)', function () {
    const isStrictPositiveInteger = utility.isStrictPositiveInteger
    it('should correctly detect strictly positive integers (> 0)', function () {
      for (let i = 1; i <= 100; i++) {
        assert.ok(isStrictPositiveInteger(i))
      }
      assert.ok(isStrictPositiveInteger(Number.MAX_SAFE_INTEGER))

    })

    it('should correctly return false', function () {
      for (let i = -100; i <= 0; i++) {
        assert.ok(!isStrictPositiveInteger(i))
      }
      assert.ok(!isStrictPositiveInteger(0.9999999999999))
      assert.ok(!isStrictPositiveInteger(0.0000000000001))
      assert.ok(!isStrictPositiveInteger(Number.NaN))
      assert.ok(!isStrictPositiveInteger(Number.POSITIVE_INFINITY))
      assert.ok(!isStrictPositiveInteger(Number.NEGATIVE_INFINITY))
      assert.ok(!isStrictPositiveInteger(Number.MAX_VALUE))
      assert.ok(!isStrictPositiveInteger(Number.MIN_VALUE))
      assert.ok(!isStrictPositiveInteger([]))
      assert.ok(!isStrictPositiveInteger([1]))
      assert.ok(!isStrictPositiveInteger([1, 2, 3]))
      assert.ok(!isStrictPositiveInteger({}))
      assert.ok(!isStrictPositiveInteger({ 1: 2 }))
      assert.ok(!isStrictPositiveInteger(() => { 1 + 1 }))
      assert.ok(!isStrictPositiveInteger(Number.MIN_SAFE_INTEGER))
    })
  })
})
