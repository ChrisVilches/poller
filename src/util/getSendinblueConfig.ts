import { SendinblueConfig } from '@notifiers/SendinblueAPI';
import * as Joi from 'joi';

const schema = Joi.object({
  apiKey: Joi.string().required(),
  senderName: Joi.string().required(),
  senderEmail: Joi.string().required(),
  recipientsListIds: Joi.array().items(Joi.number().required()).required()
})

export const getSendinblueConfig = (): SendinblueConfig | null => {
  const sendinBlueConfig = {
    apiKey: process.env.SENDINBLUE_API_KEY,
    senderName: process.env.SENDINBLUE_SENDER_NAME,
    senderEmail: process.env.SENDINBLUE_SENDER_EMAIL,
    recipientsListIds: process.env.SENDINBLUE_RECIPIENTS_LIST_IDS?.split(','),
  }
  
  const obj = schema.validate(sendinBlueConfig)

  if(obj.error) {
    return null
  }

  return obj.value as SendinblueConfig
}
