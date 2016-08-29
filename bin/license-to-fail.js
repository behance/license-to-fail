#!/usr/bin/env node

var fs = require("fs");
var args = process.argv.slice(2);

if (args[0] === "init") {
  console.log("Creating a config file");
  fs.writeFileSync("config.js", "module.exports = " + JSON.stringify(require('../example-config.js'), null, 2));
  process.exit();
}

var configPath = args[0];
var config;
var path = require('path');

function error() {
  console.error("No config path found!");
  console.error("Pass the path to a config file or");
  console.error("Add a config in package.json under 'license-to-fail' key.");
  console.error("Create a new config file with: `license-to-fail init`");
  process.exit(1);
}

if (configPath) {
  config = require(path.resolve(configPath));
} else {
  try {
    configPath = require(path.join(process.cwd(), "package.json"));
  } catch (e) {
    error();
  }
  config = configPath["license-to-fail"];
  if (!config) {
    error();
  }
}

require("../index")(config);
