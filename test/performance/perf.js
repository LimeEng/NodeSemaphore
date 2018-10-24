'use strict'

const Benchmark = require('benchmark')
const Semaphore = require('../../index.js')
const printPlatform = require('./print-platform.js')
const printBenchmarks = require('./print-benchmarks.js')

runAllBenchmarks()

async function runAllBenchmarks() {
  printPlatform()
  const bounds = [10, 100, 1000, 10000, 100000, 1000000, 5000000, 10000000]
  const benchmarks = []
  for (const bound of bounds) {
    const result = await runBasicLockTest(bound)
    benchmarks.push(result)
  }
  printBenchmarks(benchmarks)
}

async function runBasicLockTest(nbrOfPromises) {
  const info = 'Execute ' + nbrOfPromises + ' promises'
  return runSuite(info, () => {
    const promises = array(nbrOfPromises).map(() => promiseFunc())
    return createBasicPerfSuite(sem => {
      return deferred => {
        const allPromises = promises.map(promise => sem.lock(promise))
        Promise.all(allPromises)
          .then(() => deferred.resolve())
      }
    })
  })
}

function runSuite(info, suiteFactory) {
  return new Promise((resolve, reject) => {
    console.log()
    console.log(info)
    console.log('-'.repeat(info.length))
    const obj = {
      title: info,
      results: []
    }
    suiteFactory()
      .on('cycle', function (e) {
        console.log(String(e.target))
      })
      .on('complete', function () {
        for (let i = 0; i < this.length; i++) {
          obj.results.push(this[i])
        }
        resolve(obj)
      })
      .on('error', function () {
        reject()
      })
      .run({ async: true })
  })
}

function createBasicPerfSuite(createTestFunc) {
  let suite = new Benchmark.Suite()
  const semaphores = getSemaphores()

  semaphores.forEach(obj => {
    suite = suite.add(obj.name, createTestFunc(obj.semaphore), { defer: true })
  })
  return suite
}

function getSemaphores() {
  const queues = []

  queues.push({ name: 'Semaphore(1)', semaphore: new Semaphore(1) })
  queues.push({ name: 'Semaphore(2)', semaphore: new Semaphore(2) })
  queues.push({ name: 'Semaphore(10)', semaphore: new Semaphore(10) })
  queues.push({ name: 'Semaphore(100)', semaphore: new Semaphore(100) })
  queues.push({ name: 'Semaphore(1000)', semaphore: new Semaphore(1000) })
  queues.push({ name: 'Semaphore(10000)', semaphore: new Semaphore(10000) })
  queues.push({
    name: 'baseline', semaphore: {
      lock: function (thunk) {
        return thunk()
      }
    }
  })

  return queues
}

function array(bound) {
  return [...Array(bound).keys()]
}

function promiseFunc() {
  return () => new Promise((resolve, reject) => process.nextTick(resolve))
}
