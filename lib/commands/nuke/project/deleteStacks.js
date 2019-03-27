const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable, merge } = require('rxjs')

module.exports = (projectProperties, log) => Observable.create((observer) => {
  log.start('Waiting for the project infrastructure to be deleted...')

  const regex = RegExp(`^ivory-${projectProperties.name}`)
  const cmdDescribeStacks = 'aws cloudformation describe-stacks'
  const cloudformation = new AWS.CloudFormation(({ region: 'us-east-1' }))

  shell.exec(cmdDescribeStacks, { silent: true }, (code, stdout) => {
    if (code !== 0) {
      return observer.error(new Error('Fail! Stacks could not be described!'))
    }
    const stacks = JSON.parse(stdout).Stacks

    const tasks = stacks.map(stack => {
      const params = { StackName: stack.StackName }

      if (regex.test(stack.StackName)) {
        return Observable.create((observer) => {
          const cmdDeleteStack = `aws cloudformation delete-stack --stack-name ${stack.StackName}`

          shell.exec(cmdDeleteStack, code => {
            if (code !== 0) {
              return observer.error(new Error(`Failed to delete stack ${stack.StackName}`))
            }
            cloudformation.waitFor('stackDeleteComplete', params, (err, data) => {
              if (err) observer.error(err)
              else observer.complete()
            })
          })
        })
      }
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
})
