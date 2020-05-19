import {
  inquireProjectName,
  inquireRepositoryInfo,
  inquireAwsProfile,
  configureApp,
  createReactApp,
  configureAWSsdkEnv,
} from './actions'
import { create as buildCreateCommand } from './command'

export const create = buildCreateCommand({
  configureApp,
  createReactApp,
  configureAWSsdkEnv,
  inquireAwsProfile,
  inquireProjectName,
  inquireRepositoryInfo,
})
