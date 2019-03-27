const AWS = require('aws-sdk')

const { Observable } = require('rxjs')

module.exports = function (projectProperties) {
  return Observable.create((observer) => {
    const awsCredentials = projectProperties.credentials
    try {
      AWS.config.update({
        region: awsCredentials.region,
        credentials: new AWS.SharedIniFileCredentials({ profile: awsCredentials.profile })
      })

      const cf = new AWS.CloudFormation()
      cf.listStacks({}, function (err) {
        if (err) {
          observer.error(err)
        } else {
          observer.next(projectProperties)
          observer.complete()
        }
      })
    } catch (err) {
      observer.error(err)
    }
  })
}
