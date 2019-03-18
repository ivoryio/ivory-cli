const AWS = require('aws-sdk')

module.exports = (projectProperties) => {
  const projectName = projectProperties.name
  const credentials = projectProperties.credentials

  return new Promise((resolve, reject) => {
    try {
      AWS.config.update({
        region: credentials.region,
        credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
      })

      const s3 = new AWS.S3()
      const bucketName = `ivory-${projectName}-build-artifacts`
      s3.createBucket({ Bucket: bucketName }, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          return resolve({
            ...projectProperties,
            buildArtifactsBucket: {
              name: bucketName,
              location: data.Location
            }
          })
        }
      })
    } catch (err) {
      return reject(err)
    }
  })
}
