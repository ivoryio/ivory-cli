const AWS = require('aws-sdk')
const { Observable, merge } = require('rxjs')

module.exports = (projectProperties, log) => Observable.create((observer) => {
  log.start('Waiting for the project infrastructure to be deleted...')

  const regex = RegExp(`^ivory-${projectProperties.name}`)
  const cloudformation = new AWS.CloudFormation({
    region: projectProperties.credentials.region
  })

  cloudformation.describeStacks({}, (err, data) => {
    if (err) observer.error(err)

    else {
      const stacks = data.Stacks
        .filter(stack => regex.test(stack.StackName))
        .map(
          stack => {
            const params = { StackName: stack.StackName }

            return Observable.create((observer) => {
              cloudformation.deleteStack(params, (err, data) => {
                if (err) observer.error(new Error(`Failed to delete stack ${stack.StackName}`))

                else {
                  cloudformation.waitFor('stackDeleteComplete', params, (err, data) => {
                    if (err) observer.error(err)

                    else observer.complete()
                  })
                }
              })
            })
          }
        )

      merge(...stacks).subscribe({
        next: () => { },
        error: (err) => observer.error(err),
        complete: () => {
          observer.next()
          observer.complete()
        }
      })
    }
  })
})
