import shell from 'shelljs'

export const gitConfig = (awsProfile: string, repoUrl: string) => {
  return new Promise((resolve, reject) => {
    const addOrigin = `git remote add origin ${repoUrl}`
    const configCredentialHelper = `git config credential.helper '!aws --profile ${awsProfile} codecommit credential-helper $@'`
    const configCredentialHttp = `git config credential.UseHttpPath true`

    shell.exec(
      `${configCredentialHelper} && ${configCredentialHttp} && ${addOrigin}`,
      (code, _, stderr) => {
        if (code !== 0) {
          reject(stderr)
        } else {
          resolve()
        }
      }
    )
  })
}
