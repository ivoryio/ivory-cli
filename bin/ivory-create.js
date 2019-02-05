const program = require('commander')

const pkg = require('../package.json')
const create = require('../lib/commands/create.js')

program
  .version(pkg.version)
  .action((name) => create(name))
  .parse(process.argv)
