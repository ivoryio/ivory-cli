const ora = require('ora')
const clc = require('cli-color')
const { concatMap, tap } = require('rxjs/operators')

const checkIsIvoryApp = require('../checkIsIvoryApp')
const installDependecies = require('./installDependecies')

module.exports = () => {
  const log = ora('')
  checkIsIvoryApp().pipe(
    tap(() => {
      log.text = `Installing project dependencies ...`
      log.start()
    }),
    concatMap(() => installDependecies())
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onError (err) {
    log.fail(clc.red('Failed to install dependecies'))
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete () {
    log.succeed(clc.green('Project dependecies successfully installed!'))
  }
}
