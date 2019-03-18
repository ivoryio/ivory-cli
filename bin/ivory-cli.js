#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('*** ALPHA BUILD ***')
  .command('configure', 'command to configure the project using the given AWS credentials')
  .command('create', 'command to create a new project or a new pod for an existing project')
  .command('deploy', 'command deploy an entire Ivory project or an Ivory Pod')
  .command('project', 'commands to create, test and deploy an Ivory SPA web app')
  .command('pod', 'commands to create, test and deploy an Ivory pod')
  .parse(process.argv)
