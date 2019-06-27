const { concatMap } = require('rxjs/operators')

const retrieveServiceTemplate = require('./retrieveServiceTemplate')
const inquireServiceName = require('./inquireServiceName')
const inquireWhatToCreate = require('./inquireWhatToCreate')

module.exports = () => inquireWhatToCreate().pipe(
  concatMap(inquireServiceName),
  concatMap(retrieveServiceTemplate)
)