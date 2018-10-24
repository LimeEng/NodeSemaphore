'use strict'

const Table = require('cli-table3')
const colorize = require('colors/safe')

function printBenchmarks(benchmarks) {
  const longestTitle = Math.max(...(benchmarks
    .map(item => item.title)
    .map(title => title.length)))
  benchmarks.forEach(benchmark => printAsTable(benchmark, longestTitle))
}

function printAsTable(benchmark, longestTitle) {

  var table = new Table({ style: { head: [], border: [] } })

  const fastestHz = Math.max(...(benchmark.results
    .map(item => item.hz)))

  const arrays = benchmark.results.map(item => {
    let percentage = 'fastest'
    if (item.hz !== fastestHz) {
      percentage = '-' + ((1 - item.hz / fastestHz) * 100).toFixed(2) + '%'
    }
    return [
      item.name,
      formatNumber(item.hz.toFixed(item.hz < 100 ? 2 : 0)) + ' \xb1 ' + item.stats.rme.toFixed(2) + '%',
      item.stats.sample.length,
      percentage
    ]
  })

  table.push(
    [{ hAlign: 'center', colSpan: 4, content: colorize.green(padTitle(benchmark.title, longestTitle)) }],
    ['name', 'ops/sec', 'runs sampled', 'performance'].map(item => colorize.green(item))
  )
  arrays.forEach(row => table.push(row))
  console.log(table.toString())
}

function formatNumber(number) {
  return Intl.NumberFormat('en-US').format(number)
}

function padTitle(title, targetLength) {
  let end = true
  while (title.length < targetLength) {
    title = end ? title + ' ' : ' ' + title
    end = !end
  }
  return title
}

module.exports = printBenchmarks
