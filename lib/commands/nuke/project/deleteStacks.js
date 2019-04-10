const AWS = require('aws-sdk')
const { Observable, merge } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = (stacks) => readProjectProperties().pipe(
  concatMap(deleteStacks(stacks))
)

const deleteStacks = (stacks) => ({ credentials }) =>
  Observable.create((observer) => {
    const cloudformation = new AWS.CloudFormation({
      region: credentials.region
    })

    const tasks = stacks.map(stack => {
      const params = { StackName: stack }

      return Observable.create((observer) => {
        cloudformation.deleteStack(params, (err, data) => {
          if (err) observer.error(new Error(`Failed to delete stack ${stack}`))

          cloudformation.waitFor('stackDeleteComplete', params, (err, data) => {
            if (err) observer.error(new Error(`Wait for stack ${stack} to delete failed`))
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
