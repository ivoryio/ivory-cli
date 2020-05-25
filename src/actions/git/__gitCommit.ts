import shell from 'shelljs'

export const gitCommitAll = (commitMessage: string) => {
  return new Promise((resolve, reject) => {
    shell.exec(`git add *`)
    shell.exec(`git commit -m "${commitMessage}"`, (code, _, stderr) => {
      if (code !== 0) {
        reject(stderr)
      } else {
        resolve()
      }
    })
  })
}
