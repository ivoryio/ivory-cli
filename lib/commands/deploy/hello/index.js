const { concatMap } = require('rxjs/operators')

const {
  deployCICDStacks,
  triggerPipelines,
  configureCDK
} = require('./actions')

module.exports = log => config =>
  deployCICDStacks(config, log).pipe(
    concatMap(triggerPipelines(log)),
    concatMap(configureCDK)
  )
