const os = require("os");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { join } = require("path");
const chalk = require("chalk");

const homedir = os.homedir();
const path = join(homedir, ".ttb_env");
const exists = existsSync(path);

const { DEBUG } = process.env;
const debugMode = DEBUG === "ON";

const debugOn = () => {
  if (exists) {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const debugIndex = envFile.findIndex((line) => line.startsWith("DEBUG"));
    if (debugIndex === -1) {
      envFile.push(`DEBUG=ON`);
    } else {
      envFile[debugIndex] = `DEBUG=ON`;
    }
    try {
      writeFileSync(path, envFile.join(os.EOL));
      console.log(`✔️ Debug mode is ${chalk.green.bold("ON")}!`);
    } catch (err) {
      console.error(`❗Unable to turn on debug mode!`);
      if (debugMode) console.error(err);
    }
    return;
  }
  try {
    writeFileSync(path, `DEBUG=ON`);
    console.log(`✔️ Debug mode is ${chalk.green.bold("ON")}!`);
  } catch (err) {
    console.error(`❗Unable to turn on debug mode!`);
    if (debugMode) console.error(err);
  }
};

const debugOff = () => {
  if (exists) {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const debugIndex = envFile.findIndex((line) => line.startsWith("DEBUG"));
    if (debugIndex === -1) {
      envFile.push(`DEBUG=OFF`);
    } else {
      envFile[debugIndex] = `DEBUG=OFF`;
    }
    try {
      writeFileSync(path, envFile.join(os.EOL));
      console.log(`✔️ Debug mode is ${chalk.red.bold("OFF")}!`);
    } catch (err) {
      console.error(`❗Unable to turn off debug mode!`);
      if (debugMode) console.error(err);
    }
    return;
  }
  try {
    writeFileSync(path, `DEBUG=OFF`);
    console.log(`✔️ Debug mode is ${chalk.red.bold("OFF")}!`);
  } catch (err) {
    console.error(`❗Unable to turn off debug mode!`);
    if (debugMode) console.error(err);
  }
};

const debug = () => {
  try {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const debugStatus = envFile.find((line) => line.includes("DEBUG")).slice(6);
    console.log(
      `Debug mode is ${
        debugStatus === "ON" ? chalk.green.bold("ON") : chalk.red.bold("OFF")
      }!`
    );
  } catch (err) {
    console.error(`❗Unable to retrieve debug mode status!`);
    if (debugMode) console.error(err);
  }
};

module.exports = { debugOn, debugOff, debug };
