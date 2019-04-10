const AWS = require('aws-sdk')
const { Observable, merge } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = (logGroups) => readProjectProperties().pipe(
  concatMap(deleteLogGroups(logGroups))
)

const deleteLogGroups = (logGroups) => ({ credentials }) =>
  Observable.create(observer => {
    const cloudwatchlogs = new AWS.CloudWatchLogs({ region: credentials.region })

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
