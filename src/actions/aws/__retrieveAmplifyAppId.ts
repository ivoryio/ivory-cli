import AWS from 'aws-sdk'

export const retrieveAmplifyAppId = async () => {
  const cf = new AWS.CloudFormation({ region: AWS.config.region })

  const response = await cf.listExports().promise()

  return response.Exports?.find(value => value.Name === 'amplify-app-id')?.Value
}
