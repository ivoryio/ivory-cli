export const create = ({
  initAmplify,
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  configureAWSsdkEnv,
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

  configureAWSsdkEnv(awsProfile)
  const amplifyAppId = await retrieveAmplifyAppId()
  initAmplify({ projectName, awsProfile, amplifyAppId, repositoryInfo })
}
