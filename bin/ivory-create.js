#!/usr/bin/env node

const shell = require("shelljs");
const program = require("commander");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const ini = require("ini");
const path = require("path");
const os = require("os");

const pkg = require("../package.json");

main();

async function main() {
  program.version(pkg.version).arguments("<appName>").action(run);
  await program.parseAsync(process.argv);
}

async function run(appName) {
  const awsProfile = await inquireAwsProfile();
  await installReactApp(appName);
  await executePostInstall({ appName, awsProfile });
}

async function inquireAwsProfile() {
  const REFRESH_OPTION = "refresh";
  const prompt = inquirer.createPromptModule();
  const profiles = await getAWSProfiles();
  let options = choices(profiles);
  options.push({
    name: "I've updated my aws config (or credentials) file. Refresh options",
    value: REFRESH_OPTION,
  });
  const answer = await prompt([
    {
      type: "list",
      name: "profile",
      message:
        "Please choose the aws profile you would like to use for this project",
      choices: options,
    },
  ]).then((answer) => answer.profile);

  if (answer === REFRESH_OPTION) {
    return inquireAwsProfile();
  }

  return answer;

  function choices(profiles) {
    let choices = [];
    for (let value of profiles.values()) {
      choices.push({
        name: value,
        value,
      });
    }
    return choices;
  }
}

async function installReactApp(appName) {
  const result = await shell.exec(
    `yarn create react-app --template @ivoryio ${appName}`
  );

  if (result.code !== 0) {
    shell.echo("Error: create react-app failed with ivory template failed");
    shell.echo(result.stderr);
    shell.exit(1);
  }
}

async function executePostInstall({ appName, awsProfile }) {
  shell.cd(appName);
  const files = [
    "public/index.html",
    "public/manifest.json",
    "infrastructure/package.json",
  ];
  await shell.sed("-i", "PROJECT_NAME", appName, files);
  await shell.sed(
    "-i",
    "'PROJECT_NAME'",
    `'${appName}'`,
    "infrastructure/ci_cd/app.ts"
  );

  await shell.sed(
    "-i",
    "AWS_PROFILE",
    awsProfile,
    `infrastructure/package.json`
  );

  await shell.exec(`cd infrastructure && yarn`);
}

async function getAWSProfiles() {
  const dotAWSDirPath = path.normalize(path.join(os.homedir(), ".aws"));
  const credentialsFilePath = path.join(dotAWSDirPath, "credentials");
  const configFilePath = path.join(dotAWSDirPath, "config");

  fs.ensureDirSync(dotAWSDirPath);

  let credentials = {};
  let config = {};
  let profiles = new Set();
  if (fs.existsSync(credentialsFilePath)) {
    credentials = ini.parse(fs.readFileSync(credentialsFilePath, "utf-8"));

    Object.keys(credentials).forEach((profile) => profiles.add(profile));
  }
  if (fs.existsSync(configFilePath)) {
    config = ini.parse(fs.readFileSync(configFilePath, "utf-8"));

    Object.keys(config).forEach((profile) =>
      profiles.add(profile.substring(8))
    );
  }

  return profiles;
}
