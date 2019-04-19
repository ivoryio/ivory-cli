const { concatMap, tap } = require('rxjs/operators')

const deployPods = require('./deployPods')
const createCNAME = require('./createCNAME')
const syncWebApp = require('./syncWebApp')
const detectPods = require('../../detectPods')
const createDeploymentBucket = require('./createDeploymentBucket')

module.exports = (log) => detectPods().pipe(
  concatMap(deployPods(log)),
  tap(logDeployingWebApp(log)),
  concatMap(createDeploymentBucket),
  concatMap(syncWebApp),
  concatMap(createCNAME)
)

const logDeployingWebApp = (log) => () => { log.text = `Deploying web application...` }
