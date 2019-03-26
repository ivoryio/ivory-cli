#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Ivory CLI 🐘 is a tool for developing, testing and deploying SPA web applications build with the Ivory Pod Architecture (IPA).')
  .command('create', 'command to create a new Ivory project or a new pod for an existing project')
  .command('configure', 'command to configure the project using the given AWS credentials')
  .command('deploy', 'command deploy the entire project or a pod microservice')
  .command('init', 'command to install all dependencies for an existing project')
  .command('nuke', 'command to delete an Ivory pod or the infrastructure of a project')
  .parse(process.argv)
