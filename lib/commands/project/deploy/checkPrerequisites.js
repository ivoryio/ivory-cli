const shell = require('shelljs')

module.exports = function () {
  return new Promise((resolve, reject) => {
    if (!shell.which('aws')) {
      return reject(new Error('Ivory needs the AWS CLI. Please make sure that the AWS CLI is installed correctly. Please refer to https://aws.amazon.com/cli/\n'))
    }
    return resolve()
  })
}
