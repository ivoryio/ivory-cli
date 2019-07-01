const clc = require('cli-color')
const { Observable, iif } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const checkSSMConfig = require('./ssm/checkSSMConfig')
const initializeRepo = require('./git/initializeRepo')
const configureService = require('./configureService')
const inquireRegion = require('./prompt/inquireRegion')
const updateIvoryConfig = require('./ssm/updateIvoryConfig')
const createInitialPush = require('./git/createInitialPush')
const deployServiceCICD = require('./ci-cd/deployServiceCICD')
const addToCICDServices = require('./ci-cd/addToCICDServices')
const inquireServiceName = require('./prompt/inquireServiceName')
const cloneServiceTemplate = require('./git/cloneServiceTemplate')
const inquireWhatToCreate = require('./prompt/inquireWhatToCreate')

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

const createService = log => inquireServiceName().pipe(
    concatMap(inquireRegion),
    tap(logCreateService(log)),
    concatMap(cloneServiceTemplate),
    concatMap(configureService),
    concatMap(addToCICDServices),
    concatMap(initializeRepo),
    concatMap(checkSSMConfig),
    concatMap(deployServiceCICD),
    concatMap(createInitialPush),
    concatMap(updateIvoryConfig)
  )

const createUIPackage = log =>
  Observable.create(observer => {
    process.stdout.write(clc.blue('Coming soon to a repository near you...\n'))
    observer.complete()
  })

const logCreateService = log => ({serviceName}) => {
  log.text = `Waiting to create the ${serviceName} service ....`
  log.start()
}
