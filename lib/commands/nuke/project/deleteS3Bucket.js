const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (projectProperties) => Observable.create((observer) => {
  const cmdDeleteS3Bucket = `aws s3 rb s3://ivory-${projectProperties.name}-build-artifacts --force`

  shell.exec(cmdDeleteS3Bucket, { silent: true }, code => {
    if (code !== 0) {
      return observer.error(new Error('Fail for deleting S3 bucket'))
    }

    observer.next()
    observer.complete()
  })
})
