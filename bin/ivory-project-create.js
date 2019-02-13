const program = require('commander')

const pkg = require('../package.json')
const create = require('../lib/commands/project/create')

program
  .version(pkg.version)
  .action((args) => create(args))
  .parse(process.argv)