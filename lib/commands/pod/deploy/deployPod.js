const shell = require('shelljs')

module.exports = (projectProperties, podName) => {

  const bucketName = projectProperties.buildArtifactsBucket.name
  const profile = projectProperties.credentials.profile
  const region = projectProperties.credentials.region
  const projectName = projectProperties.name.toLowerCase()

  return new Promise((resolve, reject) => {
    const buildCmd = `cd src/pods/${podName}/api && mkdir -p build && yarn run build --s3-bucket ${bucketName} --profile ${profile} --region ${region}`
    shell.exec(buildCmd, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(new Error(`${stderr}`))
      }

      const identityPoolPrefix = `ivory_${projectName}`
      const projectPrefix = `ivory-${projectName}`
      const stackName = `${projectPrefix}-dev-${podName}`

      const deployCmd = `cd src/pods/${podName}/api && yarn run deploy --stack-name ${stackName} --profile ${profile} --region ${region} --parameter-overrides StageName=dev ProjectPrefix=${projectPrefix} IdentityPoolPrefix=${identityPoolPrefix}`
      shell.exec(deployCmd, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          return reject(new Error(`${stderr}`))
        }
        return resolve()
      })
    })
  })
}
