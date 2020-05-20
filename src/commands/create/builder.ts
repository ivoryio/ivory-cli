import {
  initAmplify,
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  deployInfrastructure,
  inquireRepositoryInfo,
} from './actions'

import { create as buildCreateCommand } from './command'
import { configureAWSsdkEnv, retrieveAmplifyAppId } from 'actions/aws'

export const create = buildCreateCommand({
  initAmplify,
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  configureAWSsdkEnv,
  deployInfrastructure,
  retrieveAmplifyAppId,
  inquireRepositoryInfo,
})
