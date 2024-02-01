const chalk = require("chalk");
const prompt = require("prompt");
const setup = require("./setup");
const run = require("./run");

const { TRAVIS_API_TOKEN, DEBUG } = process.env;
const debugMode = DEBUG === "ON";

const exiting = () => {
  console.log("💨 Exiting...");
  console.log("🖖 Bye!");
};

const start = async (filePath, yes) => {
  if (!TRAVIS_API_TOKEN) {
    return console.error(
      `❗Travis API token is not set! Please run ${chalk.yellow(
        "ttbcli set-token",
      )} or ${chalk.yellow("ttbcli st")} first.`,
    );
  }

  const { version, context, summary, repos } = setup(filePath);

  const PROGRESS_INFO_MSG = `\n👀 You can monitor the progress of the builds in Travis CI: https://${version <= 2 ? "" : `v${version}.`
    }travis.com`;

  if (repos.length === 0) {
    console.log("🤨 No repositories have been selected!");
    return exiting();
  }

  console.log(summary);

  if (yes) {
    await run(version, context, repos);
    console.log(PROGRESS_INFO_MSG);
    exiting();
    return;
  }

  prompt.start({ noHandleSIGINT: true });

  prompt.message = "";

  prompt.get(
    [
      {
        name: "confirm",
        type: "string",
        description:
          "❔ Are you sure you want to trigger the builds above? (yes/no)",
        default: "yes",
        required: true,
        pattern: /^(yes|no)$/,
        message: "❗Please enter yes or no!",
      },
    ],
    async (err, result) => {
      if (err) {
        console.error(
          `\n\n❗${err.message.charAt(0).toUpperCase() + err.message.slice(1)}`,
        ); // cancelled => Cancelled
        if (debugMode) console.error(err);
        return;
      }

      const { confirm } = result;

      if (confirm === "yes") {
        await run(version, context, repos);
        console.log(PROGRESS_INFO_MSG);
        exiting();
      } else {
        exiting();
      }
    },
  );
};

module.exports = start;
