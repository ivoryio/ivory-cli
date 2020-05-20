import fs from 'fs'
import path from 'path'
import { parse } from 'ini'
import { homedir } from 'os'
import inquirer from 'inquirer'

const REFRESH_OPTION = 'refresh'

export const inquireAwsProfile = async (): Promise<string> => {
  const awsProfiles = getAWSProfiles()
  const choices = [
    {
      name: 'I updated my aws config (or credentials) file. Refresh options',
      value: REFRESH_OPTION,
    },
    ...awsProfiles,
  ]
  const answer = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'awsProfile',
        message: 'Please choose the aws profile you would like to use for this project',
        choices,
      },
    ])
    .then(r => r.awsProfile)

  if (answer === REFRESH_OPTION) {
    return inquireAwsProfile()
  }

  return answer
}

function getAWSProfiles() {
  const dotAWSDirPath = path.normalize(path.join(homedir(), '.aws'))
  const credentialsFilePath = path.join(dotAWSDirPath, 'credentials')
  const configFilePath = path.join(dotAWSDirPath, 'config')

  let config = {}
  let credentials = {}
  const profiles = new Set()

  if (fs.existsSync(credentialsFilePath)) {
    credentials = parse(fs.readFileSync(credentialsFilePath, 'utf-8'))

    Object.keys(credentials).forEach(profile => profiles.add(profile))
  }
  if (fs.existsSync(configFilePath)) {
    config = parse(fs.readFileSync(configFilePath, 'utf-8'))

    Object.keys(config).forEach(profile => profiles.add(profile.substring(8)))
  }

  return Array.from(profiles).filter(p => p)
}
