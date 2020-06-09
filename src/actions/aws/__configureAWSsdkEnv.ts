export const configureAwsSdkEnv = (awsProfile: string) => {
  process.env.AWS_PROFILE = awsProfile
  process.env.AWS_SDK_LOAD_CONFIG = '1'
}
