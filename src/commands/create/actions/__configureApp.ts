import shell from 'shelljs'

export const configureApp = ({ projectName, awsProfile, repositoryInfo }: AppConfiguration) => {
  shell.cd(projectName)
  const files = ['public/index.html', 'public/manifest.json', 'infrastructure/package.json']
  shell.sed('-i', 'PROJECT_NAME', projectName, files)
  shell.sed('-i', 'PROJECT_NAME', projectName, 'infrastructure/ci_cd/app.ts')

  shell.sed('-i', 'GIT_PROVIDER', repositoryInfo.platform, 'infrastructure/ci_cd/AmplifyStack.ts')
  if (repositoryInfo.platform === 'github') {
    shell.sed(
      '-i',
      'GITHUB_OWNER',
      repositoryInfo.repoOwner as string,
      'infrastructure/ci_cd/AmplifyStack.ts'
    )
    shell.sed(
      '-i',
      'GITHUB_REPO',
      repositoryInfo.repoName as string,
      'infrastructure/ci_cd/AmplifyStack.ts'
    )
  }

  shell.sed('-i', 'AWS_PROFILE', awsProfile, `infrastructure/package.json`)

  shell.exec(`cd infrastructure && yarn install --color always`)
  shell.exec(`yarn i18n`)
}
