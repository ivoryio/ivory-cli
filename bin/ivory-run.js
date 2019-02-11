const program = require('commander')

const pkg = require('../package.json')
const run = require('../lib/commands/run/')

program
  .version(pkg.version)
  .action(() => run())
  .parse(process.argv)
