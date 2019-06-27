const { concatMap } = require('rxjs/operators')

const configureService = require('./configureService')
const createInitialPush = require('./createInitialPush')
const deployServiceCICD = require ('./deployServiceCICD')
const inquireServiceName = require('./inquireServiceName')
const inquireWhatToCreate = require('./inquireWhatToCreate')
const retrieveServiceTemplate = require('./retrieveServiceTemplate')

module.exports = () => inquireWhatToCreate().pipe(
  concatMap(inquireServiceName),
  concatMap(retrieveServiceTemplate),
  concatMap(configureService),
  concatMap(deployServiceCICD),
  concatMap(createInitialPush)
)
