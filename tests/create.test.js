const assert = require('assert')
const { create } = require('../lib/commands/create/command')

const doNothingActions = {
  initAmplify: () => {},
  gitCommitAll: () => {},
  configureApp: () => {},
  createReactApp: () => {},
  inquireAwsProfile: () => {},
  inquireProjectName: () => {},
  configureAWSsdkEnv: () => {},
  retrieveAmplifyAppId: () => {},
  deployInfrastructure: () => {},
  inquireRepositoryInfo: () => {},
}

describe('create command', () => {
  it('calls inquireProjectName', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, inquireProjectName: fakeAction })()

    assert.ok(called)
  })

  it('calls inquireAwsProfile', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, inquireAwsProfile: fakeAction })()

    assert.ok(called)
  })

  it('calls inquireRepositoryInfo', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, inquireRepositoryInfo: fakeAction })()

    assert.ok(called)
  })

  it('calls configureAWSsdkEnv', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, configureAWSsdkEnv: fakeAction })()

    assert.ok(called)
  })

  it('calls retrieveAmplifyAppId', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, retrieveAmplifyAppId: fakeAction })()

    assert.ok(called)
  })

  it('calls initAmplify', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, initAmplify: fakeAction })()

    assert.ok(called)
  })

  it('calls gitCommit', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, gitCommitAll: fakeAction })()

    assert.ok(called)
  })

  it('calls retrieveAmplifyAppId after configureAWSsdkEnv', async () => {
    let hasconfigureAWSsdkEnv
    let hasInquiredInOrder
    await create({
      ...doNothingActions,
      configureAWSsdkEnv: () => {
        hasconfigureAWSsdkEnv = true
      },
      retrieveAmplifyAppId: () => {
        hasInquiredInOrder = hasconfigureAWSsdkEnv
      },
    })()

    assert.ok(hasInquiredInOrder)
  })

  it('calls deployInfrastructure', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, deployInfrastructure: fakeAction })()

    assert.ok(called)
  })

  it('calls createReactApp', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, createReactApp: fakeAction })()

    assert.ok(called)
  })

  it('calls configureApp', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, configureApp: fakeAction })()

    assert.ok(called)
  })

  it('calls createReactApp after gathering all parameters', async () => {
    let hasInquiredAwsProfile
    let hasInquiredProjectName
    let hasInquiredGitPlatform
    let hasInquiredInOrder
    await create({
      ...doNothingActions,
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
    })()

    assert.ok(hasInquiredInOrder)
  })

  it('calls configure after creating react app', async () => {
    let hasCreatedReactApp
    let hasConfiguredAfterCreation
    await create({
      ...doNothingActions,
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
      ...doNothingActions,
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
      ...doNothingActions,
      configureApp: params => {
        actual = params
      },
      inquireAwsProfile: () => Promise.resolve(expected.awsProfile),
      inquireProjectName: () => Promise.resolve(expected.projectName),
      inquireRepositoryInfo: () => Promise.resolve(expected.repositoryInfo),
    })()

    assert.equal(actual.awsProfile, expected.awsProfile)
    assert.equal(actual.projectName, expected.projectName)
    assert.equal(actual.repositoryInfo, expected.repositoryInfo)
  })
})
