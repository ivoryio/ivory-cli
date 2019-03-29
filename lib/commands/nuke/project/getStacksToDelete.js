const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = (credentials, name) => Observable.create((observer) => {
  const cloudformation = new AWS.CloudFormation({
    region: credentials.region
  })

  const regex = RegExp(`^ivory-${name}`)

  cloudformation.describeStacks({}, (err, data) => {
    if (err) observer.error(new Error(`Describe stacks failed ...`))

    const stacks = data.Stacks.filter(stack => regex.test(stack.StackName))

    observer.next(stacks)
    observer.complete()
  })
})
