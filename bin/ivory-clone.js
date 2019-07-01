const program = require('commander')

const pkg = require('../package.json')
const create = require('../lib/commands/clone')

program
  .version(pkg.version)
  .description('Clone a deployed Ivory project.\n\
A deployed Ivory project is a project that was deployed using the ivory deploy command.\n\
The clone command will:\n\
  1. Create the folder structure\n\
  2. Clone the git repositories for each Ivory component (web, services and CI/CD)')
  .action(() => create())
  .parse(process.argv)
