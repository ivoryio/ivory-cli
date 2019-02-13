const program = require('commander')

const pkg = require('../package.json')
const create = require('../lib/commands/pod/create')

program
  .version(pkg.version)
  .action((args) => create(args))
  .parse(process.argv)
