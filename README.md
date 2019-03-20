# ivory-cli
Ivory CLI 🐘 is a tool for developing, testing and deploying SPA web applications build with the Ivory Pod Architecture (IPA).

In a nutshell with IPA you create [micro-frontends](https://micro-frontends.org/) and [microservices](https://microservices.io/patterns/microservices.html), bundle them in a pod and deploy the pod in the AWS cloud.

To create a SPA web application with IPA you can use the CLI to:

1. Create a project by running the command: **ivory create**
2. Configure the project by running the command: **ivory configure**
3. Deploy the entire project or individual microservices by running the command: **ivory deploy**
4. Create a new pod by running the command: **ivory create**

## Prerequisites
In order to use the Ivory CLI you need: [Node.js](https://nodejs.org/en/) and the [AWS CLI](https://aws.amazon.com/cli/)

## Installation

```javascript
npm i -g @ivoryio/ivory-cli
```

## Known issues or limitations

1. Project name must satisfy the following regular expression: (\w+) 
2. Please don't use `sudo` with `npm`
3. At the moment you can't deploy the greeter microservice in the same AWS region because the greeter microservice creates an SNS topic called GreetingCreated which must be unique within the AWS region


