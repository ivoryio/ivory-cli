/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

export const amplifyAddAuth = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const addProcess = spawn('amplify', ['add', 'auth'])
    let inputEnded = false
    let outputStarted = false

    setTimeout(() => {
      addProcess.stdout.on('data', data => {
        if (inputEnded) {
          return console.log(`${data}`)
        }
        if (!outputStarted) {
          runSteps(addProcess, 1)
          outputStarted = true
        }
      })
    }, 100)

    addProcess.stderr.on('data', data => {
      reject(`Auth integration failed: ${data}`)
    })

    addProcess.on('exit', function () {
      resolve()
    })

    function runSteps(process: ChildProcessWithoutNullStreams, step: number) {
      let answer = ''
      let waitTime = 0

      switch (step) {
        case 1:
          answer = '\n'
          break
        case 2:
          answer = '\u001b\u005B\u0042\n'
          waitTime = 200
          break
        case 3:
          answer = '\n'
          waitTime = 200
          inputEnded = true
          break
        case 4:
          waitTime = 2000
          break
      }
      setTimeout(() => {
        if (step < 4) {
          process.stdin.write(answer)
          runSteps(process, step + 1)
        } else {
          process.stdin.end()
        }
      }, waitTime)
    }
  })
}
