const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = () => buildWebapp().pipe(
  concatMap(readProjectProperties),
  concatMap(deployWebapp)
)

const buildWebapp = () => Observable.create(observer => {
  const cmd = 'yarn build'
  shell.exec(cmd, { silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }

    observer.next()
    observer.complete()
  })
})

const deployWebapp = (projectProperties) => Observable.create(observer => {
  const { credentials, domain, subdomain } = projectProperties
  const bucketName = `${subdomain}.${domain}`
  const profile = `${credentials.profile}`

  const cmd = `aws s3 sync ./build/ s3://${bucketName} --profile ${profile}`
  shell.exec(cmd, { silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }
    observer.next()
    observer.complete()
  })
})
