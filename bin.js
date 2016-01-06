#!/usr/bin/env node

if (process.argv.length < 4) {
  console.error('usage: run-every <runEvery> command ...');
  process.exit(1);
}

var runEvery = require('./');

var repeatWaitSeconds = process.argv[2];
var command = process.argv.slice(3);
runEvery(repeatWaitSeconds, command, process);
