import shell from 'shelljs'

export const deployInfrastructure = ({ repositoryInfo }: AppConfiguration) => {
  let env = ''
  if (repositoryInfo.platform === 'github') {
    env = `GITHUB_SECRET=${repositoryInfo.repoSecret}`
  }
  shell.exec(`cd infrastructure && ${env} yarn deploy --require-approval never --color always`)
}
