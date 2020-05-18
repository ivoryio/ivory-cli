const assert = require('assert')
const { create } = require('../lib/commands/create')

const actions = {
  configureApp: () => {},
  createReactApp: () => {},
  inquireAwsProfile: () => {},
  inquireProjectName: () => {},
  inquireGitPlatform: () => {},
}
describe('create command', () => {
  it('calls inquireProjectName', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, inquireProjectName: fakeAction })()

    assert.ok(called)
  })

  it('calls inquireAwsProfile', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, inquireAwsProfile: fakeAction })()

    assert.ok(called)
  })

  it('calls inquireGitPlatform', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, inquireGitPlatform: fakeAction })()

    assert.ok(called)
  })

  it('calls createReactApp', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, createReactApp: fakeAction })()

    assert.ok(called)
  })

  it('calls configureApp', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, configureApp: fakeAction })()

    assert.ok(called)
  })

  it('calls createReactApp after gathering all parameters', async () => {
    let hasInquiredAwsProfile
    let hasInquiredProjectName
    let hasInquiredGitPlatform
    let hasInquiredInOrder
    await create({
      configureApp: () => {},
      createReactApp: () => {
        hasInquiredInOrder =
          hasInquiredAwsProfile && hasInquiredProjectName && hasInquiredGitPlatform
      },
      inquireAwsProfile: async () => {
        hasInquiredAwsProfile = true
        return Promise.resolve('profile')
      },
      inquireProjectName: async () => {
        hasInquiredProjectName = true
        return Promise.resolve('project')
      },
      inquireGitPlatform: async () => {
        hasInquiredGitPlatform = true
        return Promise.resolve('git')
      },
    })()

    assert.ok(hasInquiredInOrder)
  })

  it('calls configure after creating react app', async () => {
    let hasCreatedReactApp
    let hasConfiguredAfterCreation
    await create({
      ...actions,
      createReactApp: () => {
        hasCreatedReactApp = true
      },
      configureApp: () => {
        hasConfiguredAfterCreation = hasCreatedReactApp
      },
    })()
    assert.ok(hasConfiguredAfterCreation)
  })

  it('creates an app with the given name', async () => {
    const expected = 'ivory-test'
    let actual = ''
    await create({
      ...actions,
      inquireProjectName: async () => Promise.resolve(expected),
      createReactApp: projectName => {
        actual = projectName
      },
    })()
    assert.equal(actual, expected)
  })

  it('configures the created app with the given parameters', async () => {
    let actual
    const expected = {
      awsProfile: 'ivory',
      projectName: 'ivory-test',
      gitPlatform: 'codecommit',
    }
    await create({
      configureApp: params => {
        actual = params
      },
      createReactApp: () => Promise.resolve(''),
      inquireAwsProfile: () => Promise.resolve(expected.awsProfile),
      inquireProjectName: () => Promise.resolve(expected.projectName),
      inquireGitPlatform: () => Promise.resolve(expected.gitPlatform),
    })()

    assert.equal(actual.projectName, expected.projectName)
    assert.equal(actual.gitPlatform, expected.gitPlatform)
    assert.equal(actual.awsProfile, expected.awsProfile)
  })
})
