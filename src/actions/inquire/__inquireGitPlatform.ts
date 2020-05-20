import inquirer from 'inquirer'

export const inquireRepositoryInfo = async () => {
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
    .then(r => r.gitPlatform)

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
    .then(r => r.repoExists)

  if (!repoExists) {
    return { platform }
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
