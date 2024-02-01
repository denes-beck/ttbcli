const chalk = require("chalk");
const fs = require("fs");
const yaml = require("js-yaml");

const ALLOWED_CONTEXTS = ["prod", "nonprod", "pu", "sonar"];

const { DEBUG } = process.env;
const debugMode = DEBUG === "ON";

const setup = (filePath) => {
  let config;

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    config = yaml.load(fileContent);
  } catch (err) {
    console.error(
      `❗Unable to read yaml file: ${chalk.yellow("build-config.yaml")}`
    );
    if (debugMode) console.error(err);
    process.exit(1);
  }

  const { version, context, repositories } = config;

  if (!ALLOWED_CONTEXTS.includes(context)) {
    console.error(
      `❗Context must be ${chalk.bold.red("prod")} or ${chalk.bold.cyan(
        "nonprod"
      )} or ${chalk.bold.cyan("pu")} or ${chalk.bold.cyan(
        "sonar"
      )}! Please correct the ${chalk.yellow("build-config.yaml")} file.`
    );
    process.exit(1);
  }

  const filtered = repositories.filter((repo) => repo.run);

  let repos = filtered.map((repo) => {
    let config;
    try {
      config = require(`./configs/${repo.owner}/${context}/${repo.name}.json`);
    } catch (err) {
      console.error(
        `❗Unable to read json file: ${chalk.yellow(
          `${repo.owner}/${context}/${repo.name}.json`
        )}`
      );
      if (debugMode) console.error(err);
      return null;
    }

    return {
      name: repo.name,
      owner: repo.owner,
      branch: repo.branch,
      config: config,
    };
  });

  repos = repos.filter((repo) => repo !== null);

  // when context is prod, we always build on the main branch
  let summary =
    "❕ For the following repositories a new " +
    (context === "prod" ? chalk.bold.red(context) : chalk.bold.cyan(context)) +
    " build will be triggered in Travis CI: \n\n";
  repos.forEach(
    ({ name, branch }) =>
      (summary += `- ${name} => ${context === "prod" ? "main" : branch}\n`)
  );

  // contexts where the branch needs to be considered
  const CUSTOM_BRANCH = ["nonprod", "pu", "sonar"];

  if (CUSTOM_BRANCH.includes(context)) {
    repos.forEach((repo) => {
      const { branch, config } = repo;

      config.request.branch = branch;
      if (context === "pu")
        // based on the config we create a pull request from the pu branch to the release branch
        config.request.config.jobs.include[0].after_success =
          config.request.config.jobs.include[0].after_success.replaceAll(
            "<base-branch>",
            branch.replace("pu", "release") // e.g. pu-YYYY-MM-DD => release-YYYY-MM-DD (head: pu-YYYY-MM-DD, base: release-YYYY-MM-DD)
          );

      delete repo.branch;
    });
  }

  return { version: version || 2, context, summary, repos };
};

module.exports = setup;
