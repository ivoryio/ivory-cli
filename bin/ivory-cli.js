#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('Ivory CLI 🐘 is a tool for developing, testing and deploying web applications build with the Ivory Architecture (IA).')
  .command('create', 'command to create a new Ivory project based on a template')
  .command('deploy', 'command to deploy the CI/CD piplines for the project')
  .parse(process.argv)
