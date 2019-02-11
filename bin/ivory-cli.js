#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .command('create', 'create a new project based on the Ivory architecture')
  .command('run', 'run on the local machine the web application connected to the backend services in the development environment')
  .command('test', 'runs E2E smoke tests on the development environment')
  .parse(process.argv)
