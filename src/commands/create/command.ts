export const create = ({
  initAmplify,
  gitCommitAll,
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  configureAwsSdkEnv,
  retrieveAmplifyAppId,
  deployInfrastructure,
  inquireRepositoryInfo,
}: CreateCommandActions) => async () => {
  const projectName = await inquireProjectName()
  const awsProfile = await inquireAwsProfile()
  const repositoryInfo = await inquireRepositoryInfo()

  createReactApp(projectName)
  configureApp({ projectName, awsProfile, repositoryInfo })
  deployInfrastructure({ projectName, awsProfile, repositoryInfo })

  configureAwsSdkEnv(awsProfile)
  const amplifyAppId = await retrieveAmplifyAppId(projectName)
  initAmplify({ projectName, awsProfile, amplifyAppId, repositoryInfo })
  await gitCommitAll('[Ivory auto-commit] initilized AWS Amplify')
}
