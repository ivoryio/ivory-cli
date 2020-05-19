const assert = require('assert')
const { create } = require('../lib/commands/create/command')

const actions = {
  configureApp: () => {},
  createReactApp: () => {},
  configureAWSsdkEnv: () => {},
  inquireAwsProfile: () => {},
  inquireProjectName: () => {},
  inquireRepositoryInfo: () => {},
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

  it('calls inquireRepositoryInfo', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, inquireRepositoryInfo: fakeAction })()

    assert.ok(called)
  })

  it('calls configureAWSsdkEnv', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...actions, configureAWSsdkEnv: fakeAction })()

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
      inquireRepositoryInfo: async () => {
        hasInquiredGitPlatform = true
        return Promise.resolve('git')
      },
      configureAWSsdkEnv: _ => {},
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
      repositoryInfo: { platform: 'codecommit' },
    }
    await create({
      configureApp: params => {
        actual = params
      },
      configureAWSsdkEnv: _ => {},
      createReactApp: () => Promise.resolve(''),
      inquireAwsProfile: () => Promise.resolve(expected.awsProfile),
      inquireProjectName: () => Promise.resolve(expected.projectName),
      inquireRepositoryInfo: () => Promise.resolve(expected.repositoryInfo),
    })()

    assert.equal(actual.awsProfile, expected.awsProfile)
    assert.equal(actual.projectName, expected.projectName)
    assert.equal(actual.repositoryInfo, expected.repositoryInfo)
  })
})
