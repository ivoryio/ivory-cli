const { concatMap } = require('rxjs/operators')

const configureService = require('./configureService')
const inquireServiceName = require('./inquireServiceName')
const inquireWhatToCreate = require('./inquireWhatToCreate')
const retrieveServiceTemplate = require('./retrieveServiceTemplate')

module.exports = () => inquireWhatToCreate().pipe(
  concatMap(inquireServiceName),
  concatMap(retrieveServiceTemplate),
  concatMap(configureService)
)