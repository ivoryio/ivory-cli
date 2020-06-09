# ivory-cli
Ivory CLI 🐘 is a tool for developing, testing and deploying Web SPAs (Single Page Applications) using the Ivory recommended template and AWS Amplify.

In a nutshell with this template you get commonplace functionalities out of the box, and the ability to deploy them in the AWS cloud.

You can create a new project by running the command: **`ivory create`**


## Prerequisites
In order to use the Ivory CLI you need:
1. [Node.js](https://nodejs.org/en/)
1. [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
1. [Amplify CLI](https://docs.amplify.aws/cli/start/install)
1. [AWS CLI](https://aws.amazon.com/cli/) (to configure named profile, or if you want to use codecommit)
1. An [AWS named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) configured on your local machine.

The AWS profile should have permissions to access the AWS account where you want the new app to be hosted and it should specify your prefered region (check [Known issues](#known-issues-or-limitations) below).


## Installation

In order to use the `ivory` command, please install this package globally.

```shell
yarn global add @ivoryio/ivory-cli
```
or
```shell
npm i -g @ivoryio/ivory-cli
```

## Creating your first project
1. Run **`ivory create`** command in CLI where you want the project folder to be created
1. Specify **name** for the project
1. Choose **AWS profile**
1. Choose which **git platform** you will be using. (CodeCommit repo is created by the command, for the other options you'll need to create the repo separately)
1. Wait for the magic to finish. And you’ll have initial project structure, all stacks created, a repository created and all services deployed.
1. Run `yarn start` to see it in action.

## Known issues or limitations

1. Please make sure that you have specified your prefered `region` (and `output`) in `~/.aws/config` file
1. If the create commands terminates early with an error, there is no way to recover so you have to destroy all created cloud resources, delete the local project folder and start again
1. Project name must satisfy the following regular expression: (\w+)
1. We recommend to only use yarn to install dependencies and run project scripts
1. Some amplify configurations can not be automated yet, so a few manual steps are still need in the Amplify console to ensure an optimal experience
    * In the Amplify Console, on the homepage of your app, click the **Edit** text next to "*Continuous deploys set up*", select `master` backend environment and save.
    * Under **Build settings**, replace the build spec provided with the contents of the `amplify.yml` file in the root of your new project.


## The resulting project

The resulting project uses Typescript whenever possible (from the app code, to infrastructure code and even the tests).
For best results we recommend all new code to be written in Typescript as well.

### Folder structure
```
root
   ├─ amplify          - amplify resources, mostly generated files
   ├─ cypress          - E2E tests folder
   ├─ infrastructure   - code to create cloud Amplify app and codecommit repo
   ├─ public           - contains root index.html and some other static files
   └─ src
      ├─ app
      │ ├─ assets           - app assets folder
      │ ├─ components       - contains app components and styleguides in .md files
      │ ├─ screens          - folder with all app screens
      │ ├─ Root.test.tsx    - Root component correct rendering test
      │ ├─ Root.tsx         - app root entry, home for Context providers
      │ └─ Router.tsx       - app router
      ├─ hooks            - folder with useful custom hooks such as useToast, useBoolean, etc
      ├─ locales          - store language json files and generates keys for each word
      ├─ modules          - the micro frontends folder
      │  └─ @auth           - user authentication module
      ├─ aws-exports.js   - amplify config, generated
      ├─ index.tsx        - project root entrypoint
      ├─ serviceWorker.ts - register, check and unregister of service workers
      └─ setupTests.ts    - setup of jest-dom tests
```

### Testing

The E2E tests are made using [cypress](https://www.cypress.io/) and all tests are in the **cypress** folder from root directory, which has the following structure:
 - **fixtures** - the folder with fixtures which can be used in any test suite. All fixtures are define using **.json** files which contains relevant mock data which is used in E2E tests. We recommend storage of mock data into fixtures which will represent single source of truth, this way we avoid any typo from tests.
 - **integration** - the folder which contains all E2E test suites. In order to add new tests you need to create new **.spec.ts** file inside this folder. We recommend to store all tests for one entity or for one functionality from the app into single **.spec.ts** file which will contain a suite of tests for it because is easier to manage.
 - **plugins** - the folder which contains plugins that you need to load when the project is opened or re-opened. You can read more [here](https://on.cypress.io/plugins-guide)
 - **support** - the folder which contains support files such as commands. [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax) have important role in wrapping a sequence of actions which are repeating in more tests into one single command, and then to use it everywhere by specifying needed arguments, if needed. You can add a new command using the following syntax `Cypress.Commands.add(name, callbackFn)`, and then inside the callback function you can specify actions for the difined command.

You can run tests by running one of these two commands in project root folder:
 - **yarn cypress:open** which will open the browser where will be displayed all tests suites and you can choose which one you want to run.
 - **yarn cypress:headless** will run all tests in headless mode, without opening the browser. The progress and tests status will be displayed into terminal window.he

We recommend looking over the [best practices](https://docs.cypress.io/guides/references/best-practices.html) for writing E2E tests with Cypress.
