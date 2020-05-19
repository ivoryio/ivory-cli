import { create as buildCreateCommand } from './create'
import {
  inquireProjectName,
  inquireRepositoryInfo,
  inquireAwsProfile,
  configureApp,
  createReactApp,
  configureAWSsdkEnv,
} from '../actions'

export const create = buildCreateCommand({
  configureApp,
  createReactApp,
  configureAWSsdkEnv,
  inquireAwsProfile,
  inquireProjectName,
  inquireRepositoryInfo,
})
