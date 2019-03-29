const AWS = require('aws-sdk')
const { Observable, merge } = require('rxjs')

module.exports = (logGroups, region) => Observable.create(observer => {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region })

  const tasks = logGroups.map(logGroupName => {
    const params = { logGroupName }
    return Observable.create(observer => {
      cloudwatchlogs.deleteLogGroup(params, (err, data) => {
        if (err) observer.error(new Error(`Failed to delete log group ${logGroupName}`))
        observer.complete()
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
