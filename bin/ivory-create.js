#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const { create } = require('../lib/commands/create/builder')

main()

async function main() {
  program.version(pkg.version).action(create)
  await program.parseAsync(process.argv)
}
