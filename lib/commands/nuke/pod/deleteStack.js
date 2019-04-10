const AWS = require('aws-sdk')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = (podName) => readProjectProperties().pipe(
  concatMap(deleteStack(podName))
)

const deleteStack = (podName) => (projectProperties) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({ region: projectProperties.credentials.region })

  const StackName = `ivory-${projectProperties.name}-dev-${podName}`
  let params = { StackName }

  cloudformation.deleteStack(params, (err, data) => {
    if (err) observer.error(err)
    cloudformation.waitFor('stackDeleteComplete', { StackName }, (err, data) => {
      if (err) observer.error(new Error(`Failed to delete stack ${StackName}.`))
      observer.next()
      observer.complete()
    })
  })
})
