const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    const arr = shell.pwd().split('/')
    const projectName = arr[arr.length - 1]
    shell.cd('z-ci-cd')

    if (!shell.test('-e', 'bin/app.ts')) {
      observer.error(
        new Error(
          'Make sure you are running the command in the root folder of the project'
        )
      )
      return
    }

    const cmd = `npm i && PROJECT_NAME=${projectName} npx cdk deploy --profile ${
      config.profile
    } --require-approval never`

    shell.exec(
      cmd,
      { silent: false, stdio: 'inherit' },
      (code, stdout, stderr) => {
        if (code !== 0) {
          return observer.error(new Error(stderr))
        }

        shell.cd('..')
        observer.next({ ...config, projectName })
        observer.complete()
      }
    )
  })
