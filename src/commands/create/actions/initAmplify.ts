/* eslint-disable no-useless-escape */
import shell from 'shelljs'

export const initAmplify = ({ projectName, awsProfile, amplifyAppId }: AppConfiguration) => {
  const command = `
  set -e
  IFS='|'

  REACTCONFIG="{\
  \"SourceDir\":'src',\
  \"DistributionDir\":"build",\
  \"BuildCommand\":'npm run-script build',\
  \"StartCommand\":'npm run-script start'\
  }"

  AWSCLOUDFORMATIONCONFIG="{\
  \"configLevel\":'project',\
  \"useProfile\":true,\
  \"profileName\":'${awsProfile}'\
  }"
  AMPLIFY="{\
  \"projectName\":'${projectName}',\
  \"envName\":'dev',\
  \"defaultEditor\":'code'\
  }"
  FRONTEND="{\
  \"frontend\":'javascript',\
  \"framework\":'react',\
  \"config\":$REACTCONFIG\
  }"
  PROVIDERS="{\
  \"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
  }"

  amplify init \
  --appId ${amplifyAppId}
  --amplify $AMPLIFY \
  --frontend $FRONTEND \
  --providers $PROVIDERS \
  --yes`

  const result = shell.exec(command)
  if (result.code !== 0) {
    shell.echo(`Error: failed to run amplify init with command: ${command}`)
    shell.echo(result.stderr)
    shell.exit(result.code)
  }
}
