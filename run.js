const axios = require("axios");
const chalk = require("chalk");
const { TRAVIS_API_TOKEN, DEBUG } = process.env;
const debugMode = DEBUG === "ON";

const run = async (version, context, repos) => {
  console.log(
    `\n🚀 run(${chalk.blue(`v${version}`)}) started in ${context === "prod" ? chalk.red.bold(context) : chalk.cyan.bold(context)
    } context...\n`,
  );
  for (const repo of repos) {
    const { name, owner, config } = repo;

    try {
      await axios({
        method: "POST",
        url: `https://${version <= 2 ? "" : `v${version}.`
          }travis.com/api/repo/${owner}%2F${name}/requests`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Travis-API-Version": "3",
          Authorization: `token ${TRAVIS_API_TOKEN}`,
        },
        data: config,
      });

      console.log(
        `✔️ Build has been started for repo: ${chalk.blue(`${owner}/${name}`)}`,
      );
    } catch (err) {
      console.error(
        `❗Unable to start build for repo: ${chalk.blue(`${owner}/${name}`)} `,
      );
      if (debugMode) console.error(err);
    }
  }
};

module.exports = run;
