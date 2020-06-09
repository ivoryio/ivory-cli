import { CloudFormation, config } from 'aws-sdk'

let cfExports: CloudFormation.Exports

export const retrieveAmplifyAppId = async (projectName: string): Promise<string> => {
  if (!cfExports) {
    await retrieveExports()
  }

  return cfExports?.find(value => value.Name === `${projectName}-amplify-app-id`)?.Value ?? 'not-found'
}

export const retrieveRepositoryUrl = async (projectName: string): Promise<string> => {
  if (!cfExports) {
    await retrieveExports()
  }

  return cfExports?.find(value => value.Name === `${projectName}-repo-url`)?.Value ?? ''
}

async function retrieveExports() {
  const cf = new CloudFormation({ region: config.region })
  const { Exports } = await cf.listExports().promise()
  cfExports = Exports ?? []
}
