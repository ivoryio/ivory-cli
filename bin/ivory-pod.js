const program = require('commander')

const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Commands that will create, test and deploy an Ivory Pod')
  .command('create', 'creates and wires an Ivory Pod')
  .command('deploy', 'deploys Pod microservices')
  .parse(process.argv)
