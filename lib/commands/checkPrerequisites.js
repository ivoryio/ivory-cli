const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = function () {
  return Observable.create((observer) => {
    if (!shell.which('aws')) {
      observer.error('Ivory needs the AWS CLI. Please make sure that the AWS CLI is installed correctly. Please refer to https://aws.amazon.com/cli/\n')
    }
    observer.next()
    observer.complete()
  })
}
