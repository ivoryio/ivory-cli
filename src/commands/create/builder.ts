import { initAmplify } from '../../actions/amplify'
import { create as buildCreateCommand } from './command'
import { configureAWSsdkEnv, retrieveAmplifyAppId } from '../../actions/aws'
import { configureApp, createReactApp, deployInfrastructure } from './actions'
import { inquireAwsProfile, inquireProjectName, inquireRepositoryInfo } from '../../actions/inquire'

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
