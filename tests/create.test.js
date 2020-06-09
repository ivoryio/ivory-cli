const assert = require('assert')
const { create } = require('../lib/commands/create/command')

const doNothingActions = {
  gitPush: () => {},
  gitConfig: () => {},
  initAmplify: () => {},
  amplifyPush: () => {},
  gitCommitAll: () => {},
  configureApp: () => {},
  createReactApp: () => {},
  amplifyAddAuth: () => {},
  inquireAwsProfile: () => {},
  inquireProjectName: () => {},
  configureAwsSdkEnv: () => {},
  retrieveAmplifyAppId: () => {},
  deployInfrastructure: () => {},
  retrieveRepositoryUrl: () => {},
  inquireRepositoryInfo: () => ({}),
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
      return {}
    }
    await create({ ...doNothingActions, inquireRepositoryInfo: fakeAction })()

    assert.ok(called)
  })

  it('calls configureAwsSdkEnv', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, configureAwsSdkEnv: fakeAction })()

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

  it('calls amplifyAddAuth', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, amplifyAddAuth: fakeAction })()

    assert.ok(called)
  })

  it('calls amplifyPush', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await create({ ...doNothingActions, amplifyPush: fakeAction })()

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

  it('calls retrieveAmplifyAppId after configureAwsSdkEnv', async () => {
    let hasconfigureAwsSdkEnv
    let hasInquiredInOrder
    await create({
      ...doNothingActions,
      configureAwsSdkEnv: () => {
        hasconfigureAwsSdkEnv = true
      },
      retrieveAmplifyAppId: () => {
        hasInquiredInOrder = hasconfigureAwsSdkEnv
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

  it('calls retrieveRepositoryUrl if platform is codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'codecommit' }),
      retrieveRepositoryUrl: fakeAction,
    })()

    assert.ok(called)
  })

  it('does not call retrieveRepositoryUrl if platform is not codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'github' }),
      retrieveRepositoryUrl: fakeAction,
    })()

    assert.equal(called, false)
  })

  it('calls gitConfig if platform is codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'codecommit' }),
      gitConfig: fakeAction,
    })()

    assert.ok(called)
  })

  it('does not call gitConfig if platform is not codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'github' }),
      gitConfig: fakeAction,
    })()

    assert.equal(called, false)
  })

  it('calls gitPush if platform is codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'codecommit' }),
      gitPush: fakeAction,
    })()

    assert.ok(called)
  })

  it('does not call gitPush if platform is not codecommit', async () => {
    let called = false

    const fakeAction = () => {
      called = true
    }
    await create({
      ...doNothingActions,
      inquireRepositoryInfo: () => Promise.resolve({ platform: 'github' }),
      gitPush: fakeAction,
    })()

    assert.equal(called, false)
  })
})
