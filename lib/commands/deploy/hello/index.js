const { concatMap } = require('rxjs/operators')

const { deployCICDStacks, triggerPipelines } = require('./actions')

module.exports = log => config =>
  deployCICDStacks(config).pipe(concatMap(triggerPipelines(log)))
