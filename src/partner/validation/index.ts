import Joi = require('joi');
import { ConfigurePartnerBodyDto } from '../dto';

type PartnersInput = {
  config: {
    body: ConfigurePartnerBodyDto;
  };
};

export const partnersValidationSchema = {
  config: Joi.object<PartnersInput['config']>({
    body: Joi.object({
      paymentCommission: Joi.number().required(),
      holdPercentage: Joi.number().required(),
    }).required(),
  }),
};
