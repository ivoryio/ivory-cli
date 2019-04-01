const program = require('commander')

const pkg = require('../package.json')
const nuke = require('../lib/commands/nuke')

program
  .version(pkg.version)
  .description('Delete an Ivory pod or the infrastructure of a project')
  .action(() => nuke())
  .parse(process.argv)
