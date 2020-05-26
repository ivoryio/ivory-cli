# ivory-cli
Ivory CLI 🐘 is a tool for developing, testing and deploying Web SPAs (Single Page Applications) using the Ivory recommended template and AWS Amplify.

In a nutshell with this template you get commonplace functionalities out of the box, and the ability to deploy them in the AWS cloud.

You can create a new project by running the command: **`ivory create`**


## Prerequisites
In order to use the Ivory CLI you need:
1. [Node.js](https://nodejs.org/en/)
2. [Amplify CLI](https://docs.amplify.aws/cli/start/install)
3. [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)

You will also need to have an [AWS named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) configured on your local machine, that has permissions to access the AWS account where you want the new app to be hosted.


## Installation

```javascript
yarn global add @ivoryio/ivory-cli
```
or
```javascript
npm i -g @ivoryio/ivory-cli
```

## Creating your first project
1. Run **`ivory create`** command in CLI where you want the project folder to be created
2. Specify **name** for the project
3. Choose **AWS profile**
4. Choose which **git platform** you will be using. (CodeCommit repo is created by the command, for the other options you'll need to create the repo separately)
5. Wait for the magic to finish. And you’ll have initial project structure, all stacks created, a repository created and all services deployed.


## Known issues or limitations

1. Project name must satisfy the following regular expression: (\w+)
2. Please make sure that you have specified your prefered `region` (and `output`) in `~/.aws/config` file
3. Sometimes `amplify push` command hangs; if this happens, you'll need to delete the `amplify` folder and run `amplify init --appId <appId> --envName master`
