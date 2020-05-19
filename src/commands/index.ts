import { create as buildCreateCommand } from './create'
import {
  inquireProjectName,
  inquireRepositoryInfo,
  inquireAwsProfile,
  configureApp,
  createReactApp,
} from '../actions'

export const create = buildCreateCommand({
  configureApp,
  createReactApp,
  inquireAwsProfile,
  inquireProjectName,
  inquireRepositoryInfo,
})
