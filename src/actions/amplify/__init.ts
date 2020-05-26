import shell from 'shelljs'

export const initAmplify = ({ projectName, awsProfile, amplifyAppId }: AppConfiguration) => {
  const AMPLIFY = `"{\\"projectName\\":\\"${projectName}\\",\\"envName\\":\\"master\\",\\"defaultEditor\\":\\"code\\"}"`

  const AWS_CLOUD_FORMATION_CONFIG = `"{\\"configLevel\\":\\"project\\",\\"useProfile\\":true,\\"profileName\\":\\"${awsProfile}\\"}"`

  const REACT_CONFIG = `"{\\"SourceDir\\":\\"src\\",\\"DistributionDir\\":\\"build\\",\\"BuildCommand\\":\\"yarn build\\",\\"StartCommand\\":\\"yarn start\\"}"`

  const FRONTEND = `"{\\"frontend\\":\\"javascript\\",\\"framework\\":\\"react\\",\\"config\\":${REACT_CONFIG}}"`

  const PROVIDERS = `"{\\"awscloudformation\\":${AWS_CLOUD_FORMATION_CONFIG}}"`

  const command = `amplify init --appId ${amplifyAppId} --amplify ${AMPLIFY} --frontend ${FRONTEND} --providers ${PROVIDERS} --yes`

  const result = shell.exec(command)
  if (result.code !== 0) {
    shell.echo(`Error: failed to run amplify init with command`)
    shell.echo(result.stderr)
    shell.exit(result.code)
  }
}
