#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .description('*** ALPHA BUILD ***')
  .command('project', 'commands to create, test and deploy an Ivory SPA web app')
  .command('pod', 'commands to create, test and deploy an Ivory pod')
  .parse(process.argv)
