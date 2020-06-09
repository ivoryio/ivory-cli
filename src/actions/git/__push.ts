import shell from 'shelljs'

export const gitPush = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    shell.exec(`git push --set-upstream origin master`, (code, _, stderr) => {
      if (code !== 0) {
        reject(stderr)
      } else {
        resolve()
      }
    })
  })
}
