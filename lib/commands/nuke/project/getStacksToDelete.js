const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = (projectProperties) => Observable.create((observer) => {
  const cloudformation = new AWS.CloudFormation({
    region: projectProperties.credentials.region
  })

  const regex = RegExp(`^ivory-${projectProperties.name}`)

  cloudformation.describeStacks({}, (err, data) => {
    if (err) observer.error(err)

    const stacks = data.Stacks.filter(stack => regex.test(stack.StackName))

    observer.next(stacks)
    observer.complete()
  })
})
