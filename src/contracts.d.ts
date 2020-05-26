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
  gitPush: () => Promise
  inquireAwsProfile: () => Promise<string>
  inquireProjectName: () => Promise<string>
  createReactApp: (projectName: string) => void
  initAmplify: (config: AppConfiguration) => void
  configureApp: (config: AppConfiguration) => void
  configureAwsSdkEnv: (awsProfile: string) => void
  gitCommitAll: (commitMessage: string) => Promise
  inquireRepositoryInfo: () => Promise<RepositoryInfo>
  deployInfrastructure: (config: AppConfiguration) => void
  gitConfig: (profileName: string, repoUrl: string) => Promise
  retrieveRepositoryUrl: (projectName: string) => Promise<string>
  retrieveAmplifyAppId: (projectName: string) => Promise<string | undefined>
}
