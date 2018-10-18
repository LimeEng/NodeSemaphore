'use strict'

const Benchmark = require('benchmark');
const Semaphore = require('../../index.js')

const suite = new Benchmark.Suite

const platform = Benchmark.platform
console.log('Executing tests on:')
console.log('==============')
console.log('Name:         ' + platform.name)
console.log('Version:      ' + platform.version)
console.log('Product:      ' + platform.product)
console.log('Manufacturer: ' + platform.manufacturer)
console.log('Layout:       ' + platform.layout)
console.log('OS:           ' + platform.os)
console.log('Description:  ' + platform.description)
console.log('==============')

for (let semLimit = 10; semLimit <= 10; semLimit++) {
  for (let amount = 10; amount <= 1000000; amount = amount * 10) {
    suite.add(generateTestCase(semLimit, amount))
  }
}

let totalTests = suite.length
let finished = 0
suite
  .on('cycle', function (event) {
    finished += 1
    console.log(finished + '/' + totalTests + ' completed: ' + event.target);
  })
  .on('complete', function () {
    console.log('============>')
    for (var i = 0; i < this.length; i++) {
      const benchmark = this[i]
      console.log(benchmark.toString());
      console.log('    ' + benchmark.times.period.toFixed(2) + ' s per test')
    }
  })
  .run({ 'async': true });

function generateTestCase(semLimit, taskCount) {
  function array(bound) {
    return [...Array(bound).keys()]
  }
  function setup() {
    // Why globals? See end of file
    global.sem = new Semaphore(semLimit)
    global.promises = array(taskCount).map(() => () => new Promise((resolve, reject) => process.nextTick(resolve)))
  }
  function fn(deferred) {
    const allPromises = promises.map((promise) => sem.lock(promise))
    Promise.all(allPromises)
      .then(() => deferred.resolve())
  }
  return {
    setup: setup,
    fn: fn,
    defer: true,
    name: 'Semaphore(' + semLimit + ') -> ' + taskCount + ' promises'
  }
}

// SOURCE: https://github.com/bestiejs/benchmark.js/issues/51

// This is because when you pass a function to benchmark.js it will attempt to decompile it and reconstruct it in a test loop.
//
// .add('create graph', function() {
//     schedule.dependencyGraph(tasks);
// },
// {
//     'setup': function() {
//         var tasks = ['A', 'B', 'C', 'D', 'E'];
//     }
// })
// becomes:
//
// var tasks = ['A', 'B', 'C', 'D', 'E'];
//
// while (....) {
//   schedule.dependencyGraph(tasks);
// }
// This would be great, however functions compiled in Node don't have access to variables your modules scope. So it can't access schedule and so throws and error and attempts to fallback to the non-compiled approach which then turns your code into:
//
// this.setup();
// while (....) {
//   schedule.dependencyGraph(tasks);
// }
// and now the test doesn't have access to tasks and throws an error.
//
// To avoid this define schedule on the global object like:
//
// global.schedule = require('../index');
