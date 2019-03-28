const fs = require('fs')
const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable, merge } = require('rxjs')

module.exports = (projectProperties, log) => Observable.create((observer) => {
  const cloudformation = new AWS.CloudFormation({
    region: projectProperties.credentials.region
  })

  const regex = RegExp(`^ivory-${projectProperties.name}`)

  log.start('Waiting for the project infrastructure to be deleted...')

  const apiConfigPath = `${shell.pwd()}/src/config/api.config.json`
  let apiConfig = require(apiConfigPath)
  apiConfig.length = 0

  fs.writeFile(apiConfigPath, JSON.stringify(apiConfig), 'utf8', (err) => {
    if (err) observer.error(err)

    cloudformation.describeStacks({}, (err, data) => {
      if (err) observer.error(err)

      const stacks = data.Stacks
        .filter(stack => regex.test(stack.StackName))
        .map(stack => {
          const params = { StackName: stack.StackName }

          return Observable.create((observer) => {
            cloudformation.deleteStack(params, (err, data) => {
              if (err) observer.error(new Error(`Failed to delete stack ${stack.StackName}`))

              cloudformation.waitFor('stackDeleteComplete', params, (err, data) => {
                if (err) observer.error(err)
                observer.complete()
              })
            })
          })
        })

      merge(...stacks).subscribe({
        next: () => { },
        error: (err) => observer.error(err),
        complete: () => {
          observer.next()
          observer.complete()
        }
      })
    })
  })
})
