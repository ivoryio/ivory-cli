const { concatMap } = require('rxjs/operators')

const configureService = require('./configureService')
const retrieveRepo = require('./retrieveRepo')
const deployService = require('./deployService')
const inquireServiceName = require('./inquireServiceName')

module.exports = () => inquireServiceName().pipe(
  concatMap(retrieveRepo),
  concatMap(configureService),
  concatMap(deployService)
)