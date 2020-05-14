#!/usr/bin/env node

const program = require("commander");
const pkg = require("../package.json");

program
  .version(pkg.version)
  .command(
    "create <appName>",
    "create a new project based on the Ivory architecture"
  )
  .parse(process.argv);
