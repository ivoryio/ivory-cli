const ora = require('ora')
const AWS = require('aws-sdk')

const { Observable } = require('rxjs')

module.exports = function (awsCredentials) {
  const log = ora('Validating credentials').start()

  return Observable.create((observer) => {
    try {
      AWS.config.update({
        region: awsCredentials.region,
        credentials: new AWS.SharedIniFileCredentials({ profile: awsCredentials.profile })
      })

      const cf = new AWS.CloudFormation()
      cf.listStacks({}, function (err) {
        if (err) {
          log.fail()
          observer.error(err)
        }
        log.succeed('Credentials valid!')
        observer.next()
        observer.complete()
      })
    } catch (err) {
      log.fail()
      observer.error(err)
    }
  })
}
