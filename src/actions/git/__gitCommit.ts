import shell from 'shelljs'

export const gitCommitAll = (commitMessage: string) => {
  return new Promise((resolve, reject) => {
    shell.exec(`git commit -am "${commitMessage}"`, (code, _, stderr) => {
      if (code !== 0) {
        reject(stderr)
      } else {
        resolve()
      }
    })
  })
}
