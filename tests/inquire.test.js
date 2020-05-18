const { inquireProjectName, inquireGitPlatform } = require('../lib/actions')
const assert = require('assert')

describe('inquireProjectName action', () => {
  it('prompts for a project name', () => {
    const expected = {
      type: 'input',
      name: 'projectName',
    }
    let actual
    const prompt = param => {
      actual = param
      return Promise.resolve({ projectName: '' })
    }

    inquireProjectName(prompt)()

    assert.equal(actual[0].type, expected.type)
    assert.equal(actual[0].name, expected.name)
  })

  it('returns the project name', async () => {
    const expected = 'ivory-test'

    const prompt = () => {
      return Promise.resolve({ projectName: expected })
    }

    const actual = await inquireProjectName(prompt)()

    assert.equal(actual, expected)
  })
})

describe('inquireGitPlatform action', () => {
  it('prompts for a git platform', () => {
    const expected = {
      type: 'list',
      name: 'gitPlatform',
    }
    let actual
    const prompt = param => {
      actual = param
      return Promise.resolve({ gitPlatform: '' })
    }

    inquireGitPlatform(prompt)()

    assert.equal(actual[0].type, expected.type)
    assert.equal(actual[0].name, expected.name)
  })

  it('returns the selected platform', async () => {
    const expected = 'codecommit'

    const prompt = () => {
      return Promise.resolve({ gitPlatform: expected })
    }

    const actual = await inquireGitPlatform(prompt)()

    assert.equal(actual, expected)
  })
})
