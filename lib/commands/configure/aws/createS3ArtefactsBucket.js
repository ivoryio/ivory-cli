const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = (projectProperties) => {
  const projectName = projectProperties.name
  const credentials = projectProperties.credentials

  return Observable.create((observer) => {
    try {
      AWS.config.update({
        region: credentials.region,
        credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
      })

      const s3 = new AWS.S3()
      const bucketName = `ivory-${projectName}-build-artifacts`
      s3.createBucket({ Bucket: bucketName }, (err, data) => {
        if (err) {
          observer.error(err)
        } else {
          observer.next({
            ...projectProperties,
            buildArtifactsBucket: {
              name: bucketName,
              location: data.Location
            }
          })
          observer.complete()
        }
      })
    } catch (err) {
      observer.error(err)
    }
  })
}
