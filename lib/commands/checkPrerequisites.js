const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
    if (!isAWSCLIInstalled()) {
      observer.error(new Error('Ivory CLI needs the AWS CLI. Please make sure that the AWS CLI is installed correctly. Please refer to https://aws.amazon.com/cli/'))
    } else if (!isNodeInstalled()) {
      observer.error(new Error('Ivory CLI needs Node.js. Please make sure that Node.js is installed correctly. Please refer to https://nodejs.org/en/'))
    } else if (!isYarnInstalled()) {
      observer.error(new Error('Ivory CLI needs yarn. Please make sure that yarn is installed correctly. Please refer to https://yarnpkg.com/en/'))
    }

    observer.next()
    observer.complete()

    function isAWSCLIInstalled () {
      return shell.which('aws')
    }
    function isNodeInstalled () {
      return shell.which('node')
    }
    function isYarnInstalled () {
      return shell.which('yarn')
    }
  })
