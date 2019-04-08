const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = (credentials, name) => () => Observable.create((observer) => {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region: credentials.region })

  const describeParams = { logGroupNamePrefix: `/aws/lambda/ivory-${name}` }

  cloudwatchlogs.describeLogGroups(describeParams, (err, data) => {
    if (err) observer.error(new Error(`Describe log groups failed ...`))

    if (data.logGroups.length !== 0) {
      data.logGroups.map(pod => {
        const deleteParams = { logGroupName: pod.logGroupName }

        cloudwatchlogs.deleteLogGroup(deleteParams, (err, data) => {
          if (err) observer.error(new Error(`Delete log group ${pod.logGroupName} failed ...`))
          observer.next()
          observer.complete()
        })
      })
    }
    observer.complete()
  })
})
