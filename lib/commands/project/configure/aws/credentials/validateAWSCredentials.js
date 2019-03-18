const ora = require('ora')
const AWS = require('aws-sdk')

module.exports = function (awsCredentials) {
  const log = ora('Validating credentials').start()

  return new Promise((resolve, reject) => {
    try {
      AWS.config.update({
        region: awsCredentials.region,
        credentials: new AWS.SharedIniFileCredentials({ profile: awsCredentials.profile })
      })

      const cf = new AWS.CloudFormation()
      cf.listStacks({}, function (err) {
        if (err) {
          log.fail()
          return reject(err)
        }
        log.succeed('Credentials valid!')
        resolve()
      })
    } catch (err) {
      log.fail()
      reject(err)
    }
  })
}
