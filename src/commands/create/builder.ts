import { initAmplify, amplifyAddAuth } from '../../actions/amplify'
import { create as buildCreateCommand } from './command'
import { gitPush, gitCommitAll, gitConfig } from '../../actions/git'
import { configureApp, createReactApp, deployInfrastructure } from './actions'
import { configureAwsSdkEnv, retrieveAmplifyAppId, retrieveRepositoryUrl } from '../../actions/aws'
import { inquireAwsProfile, inquireProjectName, inquireRepositoryInfo } from '../../actions/inquire'

export const create = buildCreateCommand({
  gitPush,
  gitConfig,
  initAmplify,
  gitCommitAll,
  configureApp,
  createReactApp,
  amplifyAddAuth,
  inquireAwsProfile,
  inquireProjectName,
  configureAwsSdkEnv,
  deployInfrastructure,
  retrieveAmplifyAppId,
  retrieveRepositoryUrl,
  inquireRepositoryInfo,
})
