const program = require('commander')

const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Commands that will create, test and deploy an Ivory SPA web app')
  .command('create', 'creates the project structure of an Ivory app')
  .command('deploy', 'creates the AWS CloudFormation stacks and configures AWS Amplify.')
  .parse(process.argv)
