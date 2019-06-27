const clc = require('cli-color')
const { Observable, iif } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const configureService = require('./configureService')
const createInitialPush = require('./createInitialPush')
const deployServiceCICD = require('./deployServiceCICD')
const inquireServiceName = require('./inquireServiceName')
const inquireWhatToCreate = require('./inquireWhatToCreate')
const retrieveServiceTemplate = require('./retrieveServiceTemplate')

module.exports = log =>
  inquireWhatToCreate().pipe(
    concatMap(serviceType =>
      iif(
        () => serviceType === 'service',
        createService(log),
        createUIPackage(log)
      )
    )
  )

const createService = log => 
  inquireServiceName().pipe(
    tap(logCreateService(log)),
    concatMap(retrieveServiceTemplate),
    concatMap(configureService),
    concatMap(deployServiceCICD),
    concatMap(createInitialPush)
  )
const createUIPackage = log => 
  Observable.create(observer => {
    process.stdout.write(clc.blue('Coming soon to a repository near you...\n'))
    observer.complete()
  })

const logCreateService = log => serviceName => {
  log.text = `Waiting to create and deploy ${serviceName} ....`
  log.start()
}
