#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .description(
    'Ivory CLI 🐘 is a tool for developing, testing and deploying Ivory web applications.'
  )
  .command('create', 'create a new project based on a template')
  .command('deploy', 'deploy an existing project')
  .command('clone', 'clone a deployed project')
  .parse(process.argv)
