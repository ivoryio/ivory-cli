const { concatMap } = require('rxjs/operators')

const { deployCICDStacks, triggerPipelines } = require('./actions')

module.exports = log => config =>
  deployCICDStacks(config, log).pipe(concatMap(triggerPipelines(log)))
