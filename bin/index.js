#!/usr/bin/env node

const { join } = require("path");
const os = require("os");
const homedir = os.homedir();
require("dotenv").config({ path: join(homedir, ".ttb_env") });

const start = require("../start");
const { debugOn, debugOff, debug } = require("../debug");
const {
  setToken,
  getToken,
  setTokenPrompt,
  removeToken,
  reset,
} = require("../token");
const yargs = require("yargs");

const options = yargs
  .scriptName("ttbcli")
  .command({
    command: "*",
    handler: () => yargs.showHelp(),
  })
  .command({
    command: "run",
    aliases: ["r"],
    desc: "Trigger the Travis build",
    builder: (yargs) =>
      yargs
        .usage("Usage: -f <path>")
        .option("file", {
          alias: "f",
          describe: "Path to the yaml file",
          type: "string",
          demandOption: true,
        })
        .usage("Usage: -t <travis api token>")
        .option("token", {
          alias: "t",
          describe: "Set the Travis API token",
          type: "string",
          demandOption: false,
        })
        .option("yes", {
          alias: "y",
          describe: "Automatic yes to prompts",
          type: "boolean",
          demandOption: false,
        })
        .help(false)
        .version(false),
  })
  .command({
    command: "set-token",
    aliases: ["st"],
    desc: "Set the Travis API token",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "get-token",
    aliases: ["gt"],
    desc: "Get the Travis API token",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "remove-token",
    aliases: ["rt"],
    desc: "Remove the Travis API token",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "debug-on",
    aliases: ["do"],
    desc: "Turn on debug mode",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "debug-off",
    aliases: ["df"],
    desc: "Turn off debug mode",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "debug",
    aliases: ["d"],
    desc: "Get debug mode status",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .command({
    command: "reset",
    aliases: ["re"],
    desc: "Remove all environment variables",
    builder: (yargs) => yargs.help(false).version(false),
  })
  .help().argv;

const { _, file, token, yes } = options;

if (token) setToken(token);

if (_[0] === "run" || _[0] === "r") start(file, yes);

if (_[0] === "set-token" || _[0] === "st") setTokenPrompt();

if (_[0] === "get-token" || _[0] === "gt") getToken();

if (_[0] === "remove-token" || _[0] === "rt") removeToken();

if (_[0] === "debug-on" || _[0] === "do") debugOn();

if (_[0] === "debug-off" || _[0] === "df") debugOff();

if (_[0] === "debug" || _[0] === "d") debug();

if (_[0] === "reset" || _[0] === "re") reset();
