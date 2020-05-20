type GitPlatform = 'codecommit' | 'github' | 'other'

interface RepositoryInfo {
  platform: GitPlatform
  repoOwner?: string
  repoName?: string
  repoSecret?: string
}

interface AppConfiguration {
  awsProfile: string
  projectName: string
  amplifyAppId?: string
  repositoryInfo: RepositoryInfo
}

interface CreateCommandActions {
  inquireAwsProfile: () => Promise<string>
  inquireProjectName: () => Promise<string>
  createReactApp: (projectName: string) => void
  initAmplify: (config: AppConfiguration) => void
  configureApp: (config: AppConfiguration) => void
  configureAWSsdkEnv: (awsProfile: string) => void
  gitCommitAll: (commitMessage: string) => Promise
  inquireRepositoryInfo: () => Promise<RepositoryInfo>
  retrieveAmplifyAppId: () => Promise<string | undefined>
  deployInfrastructure: (config: AppConfiguration) => void
}
