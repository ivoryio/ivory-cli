const assert = require('assert')
const { add } = require('../lib/commands/add/command')

const doNothingActions = {
  gitPush: () => {},
}

describe('add command', () => {
  it.skip('calls inquireProjectName', async () => {
    let called = false
    const fakeAction = () => {
      called = true
    }
    await add({ ...doNothingActions, inquireProjectName: fakeAction })()

    assert.ok(called)
  })
})
