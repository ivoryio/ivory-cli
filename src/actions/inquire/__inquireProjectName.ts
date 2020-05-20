import inquirer from 'inquirer'

export const inquireProjectName = async () =>
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Please enter a project name (it must be valid as a folder or package name)',
        validate: input => !!input.trim(),
      },
    ])
    .then(r => r.projectName)
