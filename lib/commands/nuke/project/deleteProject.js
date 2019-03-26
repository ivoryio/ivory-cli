const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  let stacksToDelete = []

  const cmdDescribeStacks = 'aws cloudformation describe-stacks'

  shell.exec(cmdDescribeStacks, { silent: true } ,(code, stdout) => {
    const stacks = JSON.parse(stdout).Stacks

    stacks.map(stack => stacksToDelete.push(stack.StackName))
    
    observer.next()
    observer.complete()
  })
})