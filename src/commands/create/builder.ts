import { gitCommitAll } from '../../actions/git'
import { initAmplify } from '../../actions/amplify'
import { create as buildCreateCommand } from './command'
import { configureAwsSdkEnv, retrieveAmplifyAppId } from '../../actions/aws'
import { configureApp, createReactApp, deployInfrastructure } from './actions'
import { inquireAwsProfile, inquireProjectName, inquireRepositoryInfo } from '../../actions/inquire'

export const create = buildCreateCommand({
  initAmplify,
  gitCommitAll,
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  configureAwsSdkEnv,
  deployInfrastructure,
  retrieveAmplifyAppId,
  inquireRepositoryInfo,
})
