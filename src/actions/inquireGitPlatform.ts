import { PromptModule } from 'inquirer'

export const inquireGitPlatform = (prompt: PromptModule) => async () =>
  await prompt([
    {
      type: 'list',
      name: 'gitPlatform',
      message: 'Where is the repository going to be?',
      choices: ['codecommit', 'github', 'other'],
      default: 0,
    },
  ]).then(r => r.gitPlatform)
