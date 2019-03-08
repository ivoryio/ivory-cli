const Joi = require('joi')

module.exports = (projectProperties) => {
  const credentialsSchema = Joi.object().keys({
    region: Joi.string().required(),
    profile: Joi.string().required()
  })

  const buildArtifactsBucket = Joi.object().keys({
    name: Joi.string().required(),
    location: Joi.string().required()
  })

  const propsSchema = Joi.object().keys({
    name: Joi.string().required(),
    credentials: credentialsSchema.required(),
    buildArtifactsBucket: buildArtifactsBucket.required()
  })

  return new Promise((resolve, reject) => {
    const result = Joi.validate(projectProperties, propsSchema)

    if (result.error) {
      return reject(new Error(`Invalid project properties: ${result.error.message}. Please run <ivory project configure>`))
    } else {
      return resolve(projectProperties)
    }
  })
}
