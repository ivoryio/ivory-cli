import AWS from 'aws-sdk'

export const retrieveAmplifyAppId = async ({ awsProfile }: AppConfiguration) => {
  process.env.AWS_PROFILE = awsProfile

  // just get region from AppConfiguration and inquire the region from the user
  const cf = new AWS.CloudFormation({ region: 'eu-central-1' })

  const response = await cf.listExports().promise()

  return response.Exports?.find(value => value.Name === 'amplify-app-id')?.Value
}
