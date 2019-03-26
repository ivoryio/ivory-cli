const program = require('commander')

const pkg = require('../package.json')
const init = require('../lib/commands/init')

program
  .version(pkg.version)
  .description('Install all dependecies for an existing project')
  .action(() => init())
  .parse(process.argv)
