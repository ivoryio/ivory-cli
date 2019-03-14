const program = require('commander')

const pkg = require('../package.json')
const configure = require('../lib/commands/configure')

program
  .version(pkg.version)
  .action(() => configure())
  .parse(process.argv)
