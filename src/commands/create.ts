export const create = ({
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireGitPlatform,
  inquireProjectName,
}: CreateCommandActions) => async () => {
  const projectName = await inquireProjectName()
  const awsProfile = await inquireAwsProfile()
  const gitPlatform = await inquireGitPlatform()
  createReactApp(projectName)
  configureApp({ projectName, awsProfile, gitPlatform })
}

interface CreateCommandActions {
  configureApp: (config: AppConfiguration) => Promise<string>
  createReactApp: (projectName: string) => Promise<string>
  inquireAwsProfile: () => Promise<string>
  inquireGitPlatform: () => Promise<GitPlatform>
  inquireProjectName: () => Promise<string>
}

interface AppConfiguration {
  projectName: string
  awsProfile: string
  gitPlatform: GitPlatform
}

type GitPlatform = 'codecommit' | 'github' | 'other'

