# ivory-cli
Ivory CLI 🐘 is a tool for developing, testing and deploying Web SPAs (Single Page Applications) using the Ivory Pod Architecture (IPA).

In a nutshell with IPA you create UI packages and microservices, and deploy them in the AWS cloud.

To create an Ivory App you can use the CLI to:

1. Create a project by running the command: **ivory create**

You can choose between 2 App types:

a) Hello - which contains the basics for a SPA Web app (SignUp, SignIn & SignOut)

b) Marketplace - which is work in progress and will contain the basics for a SPA Web Marketplace

2. Deploy the app by running the command: **ivory deploy**

The deploy command must be executed in an Ivory App root folder. The command will create the CI/CD pipelines and it will deploy the microservices and the Web SPA build files.

The deploy command will take between 30-45 minutes to finish as it creates a global CloudFront distribution. 

## Prerequisites
In order to use the Ivory CLI you need:
1. [Node.js](https://nodejs.org/en/)
2. Git
3. [AWS CLI](https://aws.amazon.com/cli/)

You will also need to configure AWS on your local machine:

1. [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
2. [Setting Up for AWS CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up.html)

## Installation

```javascript
npm i -g @ivoryio/ivory-cli
```

## Known issues or limitations

1. Project name must satisfy the following regular expression: (\w+) 
2. Please don't use `sudo` with `npm`
3. There is an issue with the Ivory Hello template which affects the CloudFront distibution and the app will not be available using the specified domain name.

# Steps For Creating App Using Ivory CLI
Before starting make sure that you have specified **region** and **output** as **json** in **config** file from **.aws** folder

Here are the actual steps:
	1. Run **ivory create** command in CLI in the folder where you want the project to be created
	2. Specify **name** for the project
	3. Choose **AWS profile**
	4. Choose or specify where do you want your **repo** to be created
	5. Wait for the magic to finish. And you’ll have initial project structure, all stacks created, an repo created and all services deployed.

**Mention**: **If Can’t find module ‘../lib/commands’** error appears, then do these steps:**
1. Go to ivory-cli project root folder
2. Run **npm link** command
3. Run again **ivory create** and it will work
