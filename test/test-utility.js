'use strict'

function shouldThrow(func) {
  try {
    func()
    return false
  } catch (err) {
    return true
  }
}

async function shouldThrowAsync(func) {
  try {
    await func()
    return false
  } catch (err) {
    return true
  }
}

const shouldNotThrow = func => !shouldThrow(func)

const shouldNotThrowAsync = func => !shouldThrowAsync(func)

const wait = delay => new Promise((resolve, reject) => setTimeout(resolve, delay))

const zeroTo = bound => [...Array(bound).keys()]

module.exports = {
  shouldThrow,
  shouldThrowAsync,
  shouldNotThrow,
  shouldNotThrowAsync,
  zeroTo,
  wait
}
