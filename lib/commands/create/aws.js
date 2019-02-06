const ora = require('ora')
const AWS = require('aws-sdk')

module.exports = {
  configure: function (fsm) {
    const log = ora('Validating credentials').start()

    return new Promise((resolve, reject) => {
      try {
        AWS.config.update({
          region: fsm.awsCredentials.region,
          credentials: new AWS.SharedIniFileCredentials({ profile: fsm.awsCredentials.profile })
        })

        const cf = new AWS.CloudFormation()

        cf.listStacks({}, function (err) {
          if (err) {
            log.fail()
            return reject(err)
          }
          log.succeed()
          resolve()
        })
      } catch (err) {
        log.fail()
        reject(err)
      }
    })
  }
}
