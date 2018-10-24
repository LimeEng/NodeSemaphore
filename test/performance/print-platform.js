'use strict'

const os = require('os')

function printPlatform() {
  const platform = `${os.type()} ${os.release()} ${os.arch()}`
  const node = `Node.js ${process.versions.node}`
  const v8 = `V8 ${process.versions.v8}`
  const cpus = getCpuInfo()

  console.log('Platform info:')
  console.log()
  console.log(platform)
  console.log(node)
  console.log(v8)
  console.log(cpus)
}

function getCpuInfo() {
  const cpus = os.cpus()
    .map(cpu => cpu.model)
    .reduce((acc, model) => {
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {})

  return Object.keys(cpus)
    .map(cpu => cpu + ' x ' + cpus[cpu])
    .join('\n')
}

module.exports = printPlatform
