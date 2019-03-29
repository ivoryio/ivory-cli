const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (name) => Observable.create((observer) => {
  const cmdDeleteS3Bucket = `aws s3 rb s3://ivory-${name}-build-artifacts --force`

  shell.exec(cmdDeleteS3Bucket, { silent: true }, code => {
    if (code !== 0) {
      return observer.error(new Error('Fail to delete S3 bucket'))
    }

    observer.next()
    observer.complete()
  })
})
