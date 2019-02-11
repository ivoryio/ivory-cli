const program = require('commander')

const pkg = require('../package.json')
const test = require('../lib/commands/test/')

program
  .version(pkg.version)
  .action(() => test())
  .parse(process.argv)
