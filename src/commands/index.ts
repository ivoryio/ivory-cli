import inquirer from 'inquirer'

import { create as buildCreateCommand } from './create'
import {
  inquireProjectName as buildInquireProjectNameAction,
  inquireGitPlatform as buildInquireGitPlatformAction,
} from '../actions'

const prompt = inquirer.createPromptModule()
const inquireProjectName = buildInquireProjectNameAction(prompt)
const inquireGitPlatform = buildInquireGitPlatformAction(prompt)

export const create = buildCreateCommand({
  inquireProjectName,
  inquireGitPlatform,
  configureApp: () => Promise.resolve(''),
  createReactApp: () => Promise.resolve(''),
  inquireAwsProfile: () => Promise.resolve(''),
})
