const prompt = require("prompt");
const os = require("os");
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require("fs");
const { join } = require("path");
const chalk = require("chalk");

const homedir = os.homedir();
const path = join(homedir, ".ttb_env");

const { DEBUG } = process.env;
const debugMode = DEBUG === "ON";

const setToken = (token) => {
  const exists = existsSync(path);
  if (exists) {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const tokenIndex = envFile.findIndex((line) =>
      line.startsWith("TRAVIS_API_TOKEN")
    );
    if (tokenIndex === -1) {
      envFile.push(`TRAVIS_API_TOKEN=${token}`);
    } else {
      envFile[tokenIndex] = `TRAVIS_API_TOKEN=${token}`;
    }
    try {
      writeFileSync(path, envFile.join(os.EOL));
      console.log("✔️ Travis API token has been set!");
    } catch (err) {
      console.error(`❗Unable to set Travis API token!`);
      if (debugMode) console.error(err);
    }
    return;
  }
  try {
    writeFileSync(path, `TRAVIS_API_TOKEN=${token}`);
    console.log("✔️ Travis API token has been set!");
  } catch (err) {
    console.error(`❗Unable to set Travis API token!`);
    if (debugMode) console.error(err);
  }
};

const getToken = () => {
  try {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const token = envFile
      .find((line) => line.includes("TRAVIS_API_TOKEN"))
      .split("=")[1];
    console.log(chalk.cyan(token));
  } catch (err) {
    console.error(`❗Unable to retrieve Travis API token!`);
    if (debugMode) console.error(err);
  }
};

const removeToken = () => {
  const exists = existsSync(path);
  if (exists) {
    const envFile = readFileSync(path, `utf8`).split(os.EOL);
    const filteredEnvFile = envFile.filter(
      (line) => !line.startsWith("TRAVIS_API_TOKEN")
    );

    try {
      writeFileSync(path, filteredEnvFile.join(os.EOL));
      console.log("✔️ Travis API token has been removed!");
    } catch (err) {
      console.error(`❗Unable to remove Travis API token!`);
      if (debugMode) console.error(err);
    }
  }
};

const reset = () => {
  try {
    unlinkSync(join(homedir, ".ttb_env"));
    console.log("✔️ Environment variables have been removed!");
  } catch (err) {
    console.error(`❗Unable to remove environment variables!`);
    if (debugMode) console.error(err);
  }
};

const setTokenPrompt = () => {
  prompt.start({ noHandleSIGINT: true });

  prompt.message = "";

  prompt.get(
    [
      {
        name: "token",
        type: "string",
        description: "🔑 Please enter your Travis API token",
        required: true,
        hidden: true,
      },
    ],
    async (err, result) => {
      if (err) {
        console.error(err.message);
        if (debugMode) console.error(err);
        return;
      }

      const { token } = result;

      if (token) setToken(token);
    }
  );
};

module.exports = { setToken, getToken, setTokenPrompt, removeToken, reset };
