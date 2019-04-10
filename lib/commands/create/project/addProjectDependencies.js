const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

module.exports = () => addDevDependencies.pipe(
  concatMap(addGlobalDependencies),
  concatMap(addCommitizen),
  concatMap(fixLint)
)

const addDevDependencies = Observable.create((observer) => {
  const devDeps = [
    'babel-eslint@10.0.1',
    'cypress',
    'eslint@5.15.1',
    'eslint-config-react-app',
    'eslint-plugin-babel',
    'eslint-plugin-cypress',
    'eslint-plugin-flowtype',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'husky',
    'lint-staged',
    'mocha@5.2.0',
    'mochawesome',
    'prop-types',
    'react-test-renderer',
    'react-testing-library',
    'standard'
  ].join(' ')
  const cmd = `yarn add --dev ${devDeps}`

  shell.exec(cmd, { silent: true }, code => {
    if (code !== 0) observer.error(new Error('Failed to add dev dependencies'))
    else {
      observer.next()
      observer.complete()
    }
  })
})

const addGlobalDependencies = () => Observable.create((observer) => {
  const globalDeps = [
    '@ivoryio/kogaio',
    'aws-amplify',
    'aws-amplify-react',
    'formik',
    'frint',
    'frint-react',
    'javascript-state-machine',
    'moment'
    // 'styled-components@4.2.0'
  ].join(' ')
  const cmd = `yarn add ${globalDeps}`

  shell.exec(cmd, { silent: true }, code => {
    if (code !== 0) observer.error((new Error('Failed to add global dependencies')))
    else {
      observer.next()
      observer.complete()
    }
  })
})

const addCommitizen = () => Observable.create((observer) => {
  const cmd =
    'npm install commitizen -g && commitizen init cz-conventional-changelog --yarn --dev --exact'

  shell.exec(cmd, { silent: true }, code => {
    if (code !== 0) observer.error(new Error('Failed to add global dependencies'))
    else {
      observer.next()
      observer.complete()
    }
  })
})

const fixLint = () => Observable.create((observer) => {
  const fixLint = 'yarn lint --fix'

  shell.exec(fixLint, { silent: true })
  observer.next()
  observer.complete()
})
