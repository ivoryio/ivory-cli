const AWS = require('aws-sdk')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = (projectProperties) => readProjectProperties().pipe(
  concatMap(createS3ArtefactsBucket(projectProperties))
)

const createS3ArtefactsBucket = (projectProperties) => ({ name }) => Observable.create((observer) => {
  const { credentials } = projectProperties
  try {
    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    const s3 = new AWS.S3()
    const bucketName = `ivory-${name}-build-artifacts`
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
