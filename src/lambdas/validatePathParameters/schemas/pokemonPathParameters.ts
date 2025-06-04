import Joi from 'joi';

export const pokemonPathParametersSchema: Joi.ObjectSchema<any> = Joi.object({
  pokemonName: Joi.string().min(1).required(),
}).required();
