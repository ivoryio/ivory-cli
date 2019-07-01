const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')


module.exports = config =>
  Observable.create(observer => {
    const cloudformation = new AWS.CloudFormation({region: config.region})

    try {
      shell.cd('../../z-ci-cd')
      const packagePath = `${shell.pwd()}/package.json`
      const deployCmd = require(packagePath).scripts.deploy

      shell.exec(deployCmd, { silent: true }, (code, _, stderr) => {
        if (code !== 0) {
          observer.error(new Error(stderr))
          return
        }
        retrieveRepositorySsh()
      })
    } catch (err) {
      observer.error(err)
    }

    function retrieveRepositorySsh () {
      const params = {
        StackName: `${config.projectName}-${config.serviceName}-ci-cd`
      }

      cloudformation.describeStacks(params, (err, data) => {
        if (err) {
          observer.error(err)
          return
        }
        const repositorySshUrl = data.Stacks[0].Outputs[0].OutputValue

        observer.next({ repositorySshUrl, ...config })
        observer.complete()
      })
    }
  })
