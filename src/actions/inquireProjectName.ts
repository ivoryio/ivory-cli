import { PromptModule } from 'inquirer'

export const inquireProjectName = (prompt: PromptModule) => async () =>
  await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Please enter a project name (it must be valid as a folder or package name)',
    },
  ]).then(r => r.projectName)
