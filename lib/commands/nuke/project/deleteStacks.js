const AWS = require('aws-sdk')
const { Observable, merge } = require('rxjs')

module.exports = (credentials, log, stacks) => Observable.create((observer) => {
  const cloudformation = new AWS.CloudFormation({
    region: credentials.region
  })

  log.start('Waiting for the project infrastructure to be deleted...')

  const tasks = stacks.map(stack => {
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

  merge(...tasks).subscribe({
    next: () => { },
    error: (err) => observer.error(err),
    complete: () => {
      observer.next()
      observer.complete()
    }
  })
})
