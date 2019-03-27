const AWS = require('aws-sdk')

const { Observable } = require('rxjs')

module.exports = (log, projectProperties, podName, podEnviroment) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({
    region: projectProperties.credentials.region
  })

  log.start('Waiting for the pod to be deleted')
  const StackName = `ivory-${projectProperties.name}-${podEnviroment}-${podName}`
  const params = { StackName }
  cloudformation.deleteStack(params, (err, data) => {
    if (err) observer.error(err)
    cloudformation.waitFor('stackDeleteComplete', { StackName }, (err, data) => {
      if (err) observer.error(err)
      observer.complete()
    })
  })
})
