const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => {
  return Observable.create((observer) => {
    const devDeps = [
      'cypress',
      'mocha',
      'mochawesome',
      'prop-types',
      'react-test-renderer',
      'react-testing-library'
    ].join(' ')

    const globalDeps = [
      '@ivoryio/kogaio',
      'aws-amplify',
      'aws-amplify-react',
      'frint',
      'frint-react',
      'javascript-state-machine',
      'styled-components',
      'moment',
      'formik'
    ].join(' ')
    const cmdAddCommitizen =
      'npm install commitizen -g && commitizen init cz-conventional-changelog --yarn --dev --exact'

    const cmdDev = `yarn add --dev ${devDeps}`
    const cmdGlobal = `yarn add ${globalDeps}`

    shell.exec(cmdDev, { silent: true }, code => {
      if (code !== 0) {
        return observer.error(new Error('Failed to add dev dependencies'))
      }
      shell.exec(cmdGlobal, { silent: true }, code => {
        if (code !== 0) {
          return observer.error(new Error('Failed to add global dependencies'))
        }
        shell.exec(cmdAddCommitizen, { silent: true }, code => {
          if (code !== 0) {
            return observer.error(
              new Error('Failed to install or add commitizen to your project')
            )
          }
          observer.next()
          observer.complete()
        })
      })
    })
  })
}
