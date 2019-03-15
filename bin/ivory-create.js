const program = require('commander')

const pkg = require('../package.json')
const create = require('../lib/commands/create')

program
  .version(pkg.version)
  .description('Create a new Ivory project or a new pod for an existing project')
  .action(() => create())
  .parse(process.argv)
