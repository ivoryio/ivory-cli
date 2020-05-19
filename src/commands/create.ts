export const create = ({
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireRepositoryInfo,
  inquireProjectName,
}: CreateCommandActions) => async () => {
  const projectName = await inquireProjectName()
  const awsProfile = await inquireAwsProfile()
  const repositoryInfo = await inquireRepositoryInfo()

  createReactApp(projectName)
  configureApp({ projectName, awsProfile, repositoryInfo })
}
