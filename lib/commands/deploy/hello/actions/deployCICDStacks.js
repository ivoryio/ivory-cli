const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (config, log) =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    log.text = 'Deploying CI/CD stacks, it might take between 30-45 minutes...\n'
    log.start()

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

    const cmd = `npm i && PROJECT_NAME=${projectName} HOSTED_ZONE_ID=ZNWD5HBJB1KDS APP_DOMAIN_NAME=thinslices.com npx cdk deploy --profile ${
      config.profile
    } --require-approval never`

    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(new Error(stderr))
      }

      shell.cd('..')
      observer.next({ ...config, projectName })
      observer.complete()
    })
  })
