const AWS = require('aws-sdk')
const { Observable, of } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = () => readProjectProperties().pipe(
  concatMap(updateAWSConfig),
  concatMap(createBucketName),
  concatMap(createS3Bucket),
  concatMap(putBucketPolicy),
  concatMap(putWebsiteConfiguration)
)

const updateAWSConfig = (projectProperties) => Observable.create(observer => {
  try {
    const { credentials } = projectProperties
    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    observer.next(projectProperties)
    observer.complete()
  } catch (err) {
    observer.error(err)
  }
})
const createBucketName = (projectProperties) => of(`${projectProperties.subdomain}.${projectProperties.domain}`)
const createS3Bucket = (bucketName) => Observable.create(observer => {
  const s3 = new AWS.S3()

  const params = {
    Bucket: bucketName,
    ACL: 'public-read'
  }

  s3.createBucket(params, (err) => {
    if (err) {
      return observer.error(err)
    }
    observer.next(bucketName)
    observer.complete()
  })
})
const putBucketPolicy = (bucketName) => Observable.create(observer => {
  const s3 = new AWS.S3()

  const readOnlyAnonUserPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AddPerm',
        Effect: 'Allow',
        Principal: '*',
        Action: [
          's3:GetObject'
        ],
        Resource: [
          `arn:aws:s3:::${bucketName}/*`
        ]
      }
    ]
  }
  const params = {
    Bucket: bucketName,
    Policy: JSON.stringify(readOnlyAnonUserPolicy)
  }

  s3.putBucketPolicy(params, function (err) {
    if (err) {
      return observer.error(err)
    }

    observer.next(bucketName)
    observer.complete()
  })
})
const putWebsiteConfiguration = (bucketName) => Observable.create(observer => {
  const s3 = new AWS.S3()

  var params = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'index.html'
      },
      IndexDocument: {
        Suffix: 'index.html'
      }
    }
  }

  s3.putBucketWebsite(params, function (err) {
    if (err) {
      return observer.error(err)
    }

    observer.next(bucketName)
    observer.complete()
  })
})
