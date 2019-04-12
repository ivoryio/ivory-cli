const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = () => readProjectProperties().pipe(
  concatMap(deleteBuckets)
)

const deleteBuckets = ({ name, subdomain, domain }) => Observable.create((observer) => {
  const cmdDeleteS3Buckets = `aws s3 rb s3://ivory-${name}-build-artifacts --force && aws s3 rb s3://${subdomain}.${domain} --force`

  shell.exec(cmdDeleteS3Buckets, { silent: true }, code => {
    if (code !== 0) {
      return observer.error(new Error('Fail to delete S3 bucket'))
    }

    observer.next()
    observer.complete()
  })
})
