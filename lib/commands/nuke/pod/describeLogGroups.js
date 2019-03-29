const { Observable } = require('rxjs')
const AWS = require('aws-sdk')

module.exports = (podName, projectName, region) => Observable.create(observer => {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region })
  let params = {
    logGroupNamePrefix: `/aws/lambda/ivory-${projectName}-dev-${podName}`
  }

  cloudwatchlogs.describeLogGroups(params, (err, data) => {
    if (err) observer.error(err)
    let logGroups = data.logGroups.map(logGroup => logGroup.logGroupName)

    observer.next(logGroups)
    observer.complete()
  })
})
