#!/usr/bin/env node
const pkg = require("../package.json");
const { create } = require("../lib/commands");

create(pkg.version);
