const program = require('commander')

const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Create a new Ivory project or a new pod for an existing project')
  .command('project', 'create a new Ivory project')
  .command('pod', 'create a new pod for an existing Ivory project')
  .parse(process.argv)
