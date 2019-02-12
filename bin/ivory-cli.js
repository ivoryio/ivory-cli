#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .command('project', 'commands to create, test and deploy an Ivory SPA web app')
  .parse(process.argv)
