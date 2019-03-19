const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const devDeps = [
      'babel-eslint@9.0.0',
      'cypress',
      'eslint@5.12.0',
      'eslint-config-react-app',
      'eslint-plugin-babel',
      'eslint-plugin-cypress',
      'eslint-plugin-flowtype',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'husky',
      'lint-staged',
      'mocha',
      'mochawesome',
      'prop-types',
      'react-test-renderer',
      'react-testing-library',
      'standard'
    ].join(' ')

    const globalDeps = [
      '@ivoryio/kogaio',
      'aws-amplify',
      'aws-amplify-react',
      'formik',
      'frint',
      'frint-react',
      'javascript-state-machine',
      'moment',
      'styled-components'
    ].join(' ')
    const cmdAddCommitizen =
      'npm install commitizen -g && commitizen init cz-conventional-changelog --yarn --dev --exact'

    const cmdDev = `yarn add --dev ${devDeps}`
    const cmdGlobal = `yarn add ${globalDeps}`
    const fixLint = 'yarn lint --fix'
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
          shell.exec(fixLint, { silent: true })
          observer.next()
          observer.complete()
        })
      })
    })
  })
