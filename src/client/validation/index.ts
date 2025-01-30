import Joi = require('joi');
import { CreateClientBodyDto } from '../dto';

type ClientsInput = {
  create: {
    body: CreateClientBodyDto;
  };
};

export const clientsValidationSchema = {
  create: Joi.object<ClientsInput['create']>({
    body: Joi.object({
      name: Joi.string().min(1).required(),
      aggregatorCommission: Joi.number().greater(0).required(),
    }).required(),
  }),
};
