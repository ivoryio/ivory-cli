type GitPlatform = 'codecommit' | 'github' | 'other'

interface RepositoryInfo {
  platform: GitPlatform
  repoOwner?: string
  repoName?: string
  repoSecret?: string
}

interface AppConfiguration {
  projectName: string
  awsProfile: string
  repositoryInfo: RepositoryInfo
}

interface CreateCommandActions {
  inquireAwsProfile: () => Promise<string>
  inquireProjectName: () => Promise<string>
  createReactApp: (projectName: string) => void
  configureAWSsdkEnv: (awsProfile: string) => void
  configureApp: (config: AppConfiguration) => void
  inquireRepositoryInfo: () => Promise<RepositoryInfo>
  retrieveAmplifyAppId: () => Promise<string | undefined>
  deployInfrastructure: (config: AppConfiguration) => void
}
