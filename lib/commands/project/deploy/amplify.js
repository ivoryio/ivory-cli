const ora = require('ora')
const shell = require('shelljs')

module.exports = {
  configure: function (fsm, cfOutputs) {
    const log = ora('Configuring AWS Amplify').start()

    return new Promise((resolve, reject) => {
      try {
        shell.cd(`./src/config`)

        shell.sed('-i', 'AWS_COGNITO_REGION', fsm.awsCredentials.region, 'aws.config.js')
        shell.sed('-i', 'AWS_COGNITO_USER_POOL_ID', cfOutputs.find(out => out.OutputKey === 'UserPoolId').OutputValue, 'aws.config.js')
        shell.sed('-i', 'AWS_COGNITO_WEB_CLIENT_ID', cfOutputs.find(out => out.OutputKey === 'UserPoolClientId').OutputValue, 'aws.config.js')
        shell.sed('-i', 'AWS_COGNITO_IDENTITY_POOL_ID', cfOutputs.find(out => out.OutputKey === 'IdentityPoolId').OutputValue, 'aws.config.js')

        log.succeed()
        resolve()
      } catch (err) {
        log.fail()
        reject(err)
      }
    })
  }
}
