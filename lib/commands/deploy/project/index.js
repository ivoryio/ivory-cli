const clc = require('cli-color')
const { concatMap, tap } = require('rxjs/operators')

const deployPods = require('./deployPods')
const createCNAME = require('./createCNAME')
const syncWebApp = require('./syncWebApp')
const detectPods = require('../../detectPods')
const createDeploymentBucket = require('./createDeploymentBucket')

module.exports = (log) => detectPods().pipe(
  tap(logDeployingPods(log)),
  concatMap(deployPods),
  tap(logDeployingWebApp),
  concatMap(createDeploymentBucket),
  concatMap(syncWebApp),
  concatMap(createCNAME)
)

const logDeployingPods = (log) => () => {
  process.stdout.write(clc.yellow('This will take a few minutes!\n'))
  log.text = `Deploying pod microservices...`
  log.start()
}

const logDeployingWebApp = (log) => () => { log.text = `Deploying web application...` }
