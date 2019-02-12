const ora = require('ora')
const AWS = require('aws-sdk')
const shell = require('shelljs')

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
          log.succeed('Credentials valid!')
          resolve()
        })
      } catch (err) {
        log.fail()
        reject(err)
      }
    })
  },
  deployStack: function (fsm) {
    const log = ora('Creating AWS CloudFormation stacks').start()

    return new Promise((resolve, reject) => {
      try {
        if (!shell.test('-e', './src/pods/user/api/')) {
          return reject(new Error("Can't find path ./src/pods/user/api/, make sure you run the command in the root directory of the project"))
        }
        shell.cd(`./src/pods/user/api/`)
        createBuildDirectory()

        const s3 = new AWS.S3()
        const bucketName = `${fsm.projectName}-dev-lambda-builds`
        s3.createBucket({ Bucket: bucketName }, (err) => {
          if (err) {
            log.fail()
            return reject(err)
          }

          const packageCmd = `aws cloudformation package --template-file infrastructure.yaml --output-template-file build/infrastructure.packaged.yaml --s3-bucket ${bucketName} --profile ${fsm.awsCredentials.profile}`
          shell.exec(packageCmd, { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
              log.fail()
              return reject(stderr)
            }

            const stackName = `${fsm.projectName}-dev-user`
            const deployCmd = `aws cloudformation deploy --template-file build/infrastructure.packaged.yaml --capabilities CAPABILITY_IAM --stack-name ${stackName} --parameter-overrides StageName=dev --profile ${fsm.awsCredentials.profile}`
            shell.exec(deployCmd, { silent: true }, (code, stdout, stderr) => {
              if (code !== 0) {
                log.fail()
                return reject(stderr)
              }

              const cf = new AWS.CloudFormation()
              cf.describeStacks({ StackName: stackName }, (err, data) => {
                if (err) {
                  log.fail()
                  return reject(err)
                }

                const outputs = data.Stacks.find(stk => stk.StackName === stackName).Outputs
                log.succeed('AWS CloudFormation stacks created!')
                shell.cd(`../../../../`)
                resolve(outputs)
              })
            })
          })
        })
      } catch (err) {
        log.fail()
        reject(err)
      }
    })

    function createBuildDirectory () {
      if (!shell.test('-e', 'build')) {
        shell.mkdir('build')
      }
    }
  }
}
