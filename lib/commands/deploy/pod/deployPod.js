const fs = require('fs')
const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = (podName) => readProjectProperties().pipe(
  concatMap(packageCFTemplate(podName)),
  concatMap(deployCFTemplate),
  concatMap(updateAWSConfig),
  concatMap(({ podName, projectProperties }) => iif(
    () => podName === 'user',
    configureAppAuth({ podName, projectProperties }),
    configureAppApi({ podName, projectProperties })
  ))
)

const packageCFTemplate = (podName) => (projectProperties) => Observable.create(observer => {
  const { buildArtifactsBucket, credentials } = projectProperties
  const { name } = buildArtifactsBucket
  const { profile, region } = credentials

  const buildCmd = `cd src/pods/${podName}/api && yarn run build --s3-bucket ${name} --profile ${profile} --region ${region}`

  shell.exec(buildCmd, { silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }
    observer.next({ podName, projectProperties })
    observer.complete()
  })
})

const deployCFTemplate = ({ podName, projectProperties }) => Observable.create(observer => {
  const { credentials, name, userPoolARN } = projectProperties
  const { profile, region } = credentials

  const projectPrefix = `ivory-${name}`
  const stackName = `${projectPrefix}-dev-${podName}`
  const identityPoolPrefix = `ivory_${name.toLowerCase()}`

  if (!userPoolARN && podName !== 'user') {
    return observer.error(new Error('Missing userPoolARN in .ivory.json. The user Pod must be deployed first'))
  }

  const parameters = `StageName=dev ProjectPrefix=${projectPrefix} IdentityPoolPrefix=${identityPoolPrefix} UserPoolARN=${userPoolARN}`
  const deployCmd = `cd src/pods/${podName}/api && yarn run deploy --stack-name ${stackName} --profile ${profile} --region ${region} --parameter-overrides ${parameters}`
  shell.exec(deployCmd, { silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }
    observer.next({ podName, projectProperties })
    observer.complete()
  })
})

const updateAWSConfig = ({ podName, projectProperties }) => Observable.create(observer => {
  try {
    const { credentials } = projectProperties
    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    observer.next({ podName, projectProperties })
    observer.complete()
  } catch (err) {
    observer.error(err)
  }
})

const configureAppAuth = ({ podName, projectProperties }) => Observable.create(observer => {
  const { name, credentials } = projectProperties
  const { region } = credentials

  const projectPrefix = `ivory-${name}`
  const stackName = `${projectPrefix}-dev-${podName}`

  const cf = new AWS.CloudFormation()
  cf.describeStacks({ StackName: stackName }, (err, data) => {
    if (err) {
      return observer.error(err)
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
          return observer.error(err)
        }
        fs.writeFile('src/config/auth.config.json', file, (err) => {
          if (err) {
            return observer.error(err)
          }
          observer.next({ podName, projectProperties })
          observer.complete()
        })
      })
    } catch (err) {
      observer.error(err)
    }
  })
})

const configureAppApi = ({ podName, projectProperties }) => Observable.create(observer => {
  const { name } = projectProperties

  const projectPrefix = `ivory-${name}`
  const stackName = `${projectPrefix}-dev-${podName}`

  const cf = new AWS.CloudFormation()
  cf.describeStacks({ StackName: stackName }, (err, data) => {
    if (err) {
      return observer.error(err)
    }
    const outputs = data.Stacks[0].Outputs
    fs.readFile('src/config/api.config.json', 'utf8', function (err, data) {
      if (err) {
        return observer.error(err)
      }

      try {
        const key = outputs.find(out => out.OutputKey === 'ApiUrl')

        if (key) {
          const endpoints = JSON.parse(data)
          let endpoint = endpoints.find((e) => e.name === podName)
          if (endpoint) {
            endpoint.endpoint = key.OutputValue
          } else {
            endpoints.push({
              name: podName,
              endpoint: key.OutputValue
            })
          }

          const file = JSON.stringify(endpoints, null, 4)
          fs.writeFile('src/config/api.config.json', file, (err) => {
            if (err) {
              observer.error(err)
            }
            observer.next()
            observer.complete()
          })
        } else {
          observer.next()
          observer.complete()
        }
      } catch (err) {
        observer.error(err)
      }
    })
  })
})
