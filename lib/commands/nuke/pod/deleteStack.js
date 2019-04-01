const { Observable } = require('rxjs')
const AWS = require('aws-sdk')

module.exports = (region, projectName, podName) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({ region })

  const StackName = `ivory-${projectName}-dev-${podName}`
  let params = { StackName }

  cloudformation.deleteStack(params, (err, data) => {
    if (err) observer.error(err)
    cloudformation.waitFor('stackDeleteComplete', { StackName }, (err, data) => {
      if (err) observer.error(new Error(`Failed to delete stack ${StackName}.`))
      observer.next(podName)
      observer.complete()
    })
  })
})
