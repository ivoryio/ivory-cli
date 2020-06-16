/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { spawn, ChildProcess } from 'child_process'

export const amplifyAddAuth = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const addProcess = spawn('amplify', ['add', 'auth'])
    const questionExcerpts = [
      'Do you want to use the default authentication',
      'How do you want users to be able to sign in?',
      'Do you want to configure advanced settings?',
    ]
    const answers = ['\n', '\u001b\u005B\u0042\n', '\n']

    answerChildProcessQuestions({ childProcess: addProcess, questionExcerpts, answers })

    addProcess.stderr.on('data', data => {
      reject(`Auth integration failed: ${data}`)
    })

    addProcess.on('exit', function () {
      resolve()
    })
  })
}

export function answerChildProcessQuestions({
  childProcess,
  questionExcerpts,
  answers,
}: ChildQAParametersInterface) {
  const alreadyAnswered = answers.map(() => false)

  childProcess!.stdout!.on('data', data => {
    questionExcerpts.forEach((excerpt, index) => {
      if (`${data}`.indexOf(excerpt) > 0) {
        answer(index, `${data}`)
      }
    })
  })

  function answer(index: number, message: string) {
    if (!alreadyAnswered[index]) {
      setTimeout(() => {
        childProcess!.stdin!.write(answers[index])
        alreadyAnswered[index] = true
      }, 100)
    } else {
      console.log(message)
    }
  }
}

interface ChildQAParametersInterface {
  childProcess: ChildProcess
  questionExcerpts: Array<string>
  answers: Array<string>
}
