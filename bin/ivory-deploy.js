const program = require('commander')

const pkg = require('../package.json')
const deploy = require('../lib/commands/deploy')

program
  .version(pkg.version)
  .description('Deploy an entire Ivory project or a single Ivory Pod')
  .action((args) => deploy(args))
  .parse(process.argv)
