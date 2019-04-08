const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = () => readProjectProperties().pipe(
  concatMap(deleteBuckets)
)

const deleteBuckets = (projectProperties) => Observable.create((observer) => {
  const { name, subdomain, domain } = projectProperties
  const cmdDeleteS3Bucket = `aws s3 rb s3://ivory-${name}-build-artifacts --force`
  const cmdDeleteDeploymentS3Bucket = `aws s3 rb s3://${subdomain}.${domain} --force`

  shell.exec(cmdDeleteS3Bucket, { silent: true }, code => {
    if (code !== 0) {
      return observer.error(new Error('Fail to delete S3 bucket'))
    }

    shell.exec(cmdDeleteDeploymentS3Bucket, { silent: true }, code => {
      if (code !== 0) {
        return observer.error(new Error('Fail to delete S3 bucket'))
      }

      observer.next()
      observer.complete()
    })
  })
})
