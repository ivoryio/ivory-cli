const { concatMap } = require('rxjs/operators')

const wire = require('./wire')
const retrieveRepo = require('./retrieveRepo')
const inquireServiceName = require('./inquireServiceName')

module.exports = () => inquireServiceName().pipe(
  concatMap(retrieveRepo),
  concatMap(wire)
)