const program = require('commander')

const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Commands that will create, test and deploy an Ivory SPA web app')
  .command('create', 'creates the project structure of an Ivory app')
  .command('configure', 'configures the project using the given AWS credentials')
  .parse(process.argv)
