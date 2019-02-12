const program = require('commander')

const pkg = require('../package.json')
const deploy = require('../lib/commands/project/deploy')

program
  .version(pkg.version)
  .action(() => deploy())
  .parse(process.argv)
