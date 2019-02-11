const shell = require('shelljs')
const clc = require('cli-color')

module.exports = {
  awsCLI: function () {
    if (shell.exec('command -v aws', { silent: true }).code !== 0) {
      process.stdout.write(clc.red('Ivory needs the AWS CLI. Please make sure that the AWS CLI is installed correctly. Please refer to https://aws.amazon.com/cli/\n'))
      process.exit(1)
    }
  }
}
