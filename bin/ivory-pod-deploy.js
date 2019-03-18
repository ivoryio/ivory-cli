const program = require('commander')

const pkg = require('../package.json')
const deploy = require('../lib/commands/pod/deploy')

program
  .version(pkg.version)
  .action((args) => deploy(args))
  .parse(process.argv)
