const fs = require('fs')
const AWS = require('aws-sdk')
const shell = require('shelljs')
const { from } = require('rxjs')
const { concatMap } = require('rxjs/operators')

module.exports = (context) => {
  const { projectProperties, podName } = context
  const bucketName = projectProperties.buildArtifactsBucket.name
  const profile = projectProperties.credentials.profile
  const region = projectProperties.credentials.region
  const projectName = projectProperties.name.toLowerCase()
  const userPoolARN = projectProperties.userPoolARN
  const projectPrefix = `ivory-${projectName}`
  const stackName = `${projectPrefix}-dev-${podName}`

  const deploy$ = from(new Promise((resolve, reject) => {
    if (!userPoolARN && podName !== 'user') {
      return reject(new Error('Missing userPoolARN in .ivory.json. The user Pod must be deployed'))
    }

    const buildCmd = `cd src/pods/${podName}/api && yarn run build --s3-bucket ${bucketName} --profile ${profile} --region ${region}`
    shell.exec(buildCmd, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(new Error(`${stderr}`))
      }

      const identityPoolPrefix = `ivory_${projectName}`
      const parameters = `StageName=dev ProjectPrefix=${projectPrefix} IdentityPoolPrefix=${identityPoolPrefix} UserPoolARN=${userPoolARN}`
      const deployCmd = `cd src/pods/${podName}/api && yarn run deploy --stack-name ${stackName} --profile ${profile} --region ${region} --parameter-overrides ${parameters}`
      shell.exec(deployCmd, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          return reject(new Error(`${stderr}`))
        }
        return resolve(podName)
      })
    })
  }))

  const configure$ = (pName) => from(new Promise((resolve, reject) => {
    AWS.config.update({
      region: region,
      credentials: new AWS.SharedIniFileCredentials({ profile })
    })

    if (pName.toLowerCase() === 'user') {
      const cf = new AWS.CloudFormation()
      cf.describeStacks({ StackName: stackName }, (err, data) => {
        if (err) {
          return reject(err)
        }

        try {
          const outputs = data.Stacks[0].Outputs
          const userPoolId = outputs.find(out => out.OutputKey === 'UserPoolId').OutputValue
          const identityPoolId = outputs.find(out => out.OutputKey === 'IdentityPoolId').OutputValue
          const userPoolWebClientId = outputs.find(out => out.OutputKey === 'UserPoolClientId').OutputValue
          const userPoolARN = outputs.find(out => out.OutputKey === 'UserPoolArn').OutputValue

          const file = JSON.stringify({
            identityPoolId,
            region,
            userPoolId,
            userPoolWebClientId
          }, null, 4)

          fs.writeFile('.ivory.json', JSON.stringify({ ...projectProperties, userPoolARN }, null, 4), (err) => {
            if (err) {
              return reject(err)
            }
            fs.writeFile('src/config/auth.config.json', file, (err) => {
              if (err) {
                return reject(err)
              }
              return resolve()
            })
          })
        } catch (err) {
          reject(err)
        }
      })
    } else {
      const cf = new AWS.CloudFormation()
      cf.describeStacks({ StackName: stackName }, (err, data) => {
        if (err) {
          return reject(err)
        }

        try {
          const outputs = data.Stacks[0].Outputs
          fs.readFile('src/config/api.config.json', 'utf8', function (err, data) {
            if (err) {
              return reject(err)
            }

            try {
              const key = outputs.find(out => out.OutputKey === 'ApiUrl')

              if (key) {
                const endpoints = JSON.parse(data)
                let endpoint = endpoints.find((e) => e.name === pName)
                if (endpoint) {
                  endpoint.endpoint = key.OutputValue
                } else {
                  endpoints.push({
                    name: pName,
                    endpoint: key.OutputValue
                  })
                }

                const file = JSON.stringify(endpoints, null, 4)
                fs.writeFile('src/config/api.config.json', file, (err) => {
                  if (err) {
                    return reject(err)
                  }
                  return resolve()
                })
              } else {
                return resolve()
              }
            } catch (err) {
              return reject(err)
            }
          })
        } catch (err) {
          reject(err)
        }
      })
    }
  }))

  return deploy$.pipe(
    concatMap(pName => configure$(pName))
  )
}
