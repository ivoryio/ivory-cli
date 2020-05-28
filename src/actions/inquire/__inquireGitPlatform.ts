import inquirer from 'inquirer'

export const inquireRepositoryInfo = async (): Promise<RepositoryInfo> => {
  const platform = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'gitPlatform',
        message: 'Where is the repository going to be?',
        choices: ['codecommit', 'github', 'other'],
        default: 0,
      },
    ])
    .then(r => r.gitPlatform as GitPlatform)

  if (platform !== 'github') {
    return { platform }
  }

  const repoExists = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'repoExists',
        message: 'Does the repo already exist?',
        default: true,
      },
    ])
    .then(r => r.repoExists as boolean)

  if (!repoExists) {
    return { platform: 'other' }
  }

  const repo = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoOwner',
      message: 'Please enter repo owner',
    },
    {
      type: 'input',
      name: 'repoName',
      message: 'Please enter repo name',
    },
    {
      type: 'input',
      name: 'repoSecret',
      message: 'Please enter github secret to access the repo',
    },
  ])

  return { platform, ...repo }
}
