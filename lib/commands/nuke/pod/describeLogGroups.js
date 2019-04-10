const AWS = require('aws-sdk')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = podName => () => readProjectProperties().pipe(
  concatMap(describeLogGroups(podName))
)

const describeLogGroups = (podName) => ({ credentials, name }) =>
  Observable.create(observer => {
    const cloudwatchlogs = new AWS.CloudWatchLogs({ region: credentials.region })
    let params = {
      logGroupNamePrefix: `/aws/lambda/ivory-${name}-dev-${podName}`
    }

    cloudwatchlogs.describeLogGroups(params, (err, data) => {
      if (err) observer.error(err)
      let logGroups = data.logGroups.map(logGroup => logGroup.logGroupName)

      observer.next(logGroups)
      observer.complete()
    })
  })
