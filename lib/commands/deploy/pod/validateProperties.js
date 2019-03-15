const { Observable } = require('rxjs')
const Joi = require('joi')

module.exports = (projectProperties) => {
  return Observable.create((observer) => {
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
      buildArtifactsBucket: buildArtifactsBucket.required(),
      pods: Joi.array(),
      userPoolARN: Joi.string()
    })
    const result = Joi.validate(projectProperties, propsSchema)

    if (result.error) {
      observer.error(new Error(`Invalid project properties: ${result.error.message}. Please run <ivory project configure>`))
    } else {
      observer.next(projectProperties)
      observer.complete()
    }
  })
}
