export const create = ({
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
  retrieveAmplifyAppId,
  deployInfrastructure,
  inquireRepositoryInfo,
  retrieveRepositoryUrl,
}: CreateCommandActions) => async (): Promise<void> => {
  const projectName = await inquireProjectName()
  const awsProfile = await inquireAwsProfile()
  const repositoryInfo = await inquireRepositoryInfo()

  createReactApp(projectName)
  configureApp({ projectName, awsProfile, repositoryInfo })
  deployInfrastructure({ projectName, awsProfile, repositoryInfo })

  configureAwsSdkEnv(awsProfile)
  const amplifyAppId = await retrieveAmplifyAppId(projectName)
  initAmplify({ projectName, awsProfile, amplifyAppId })

  await amplifyAddAuth()

  await gitCommitAll('[Ivory auto-commit] initilized AWS Amplify')
  if (repositoryInfo.platform === 'codecommit') {
    const repoUrl = await retrieveRepositoryUrl(projectName)
    await gitConfig(awsProfile, repoUrl)
    await gitPush()
  }

  // TODO show exit message
}
