import { Event, Context } from 'aws-lambda';

import { pokemonPathParametersSchema } from './schemas/pokemonPathParameters';
import { ValidatePathParametersController } from './infraestructure/validatePathParametersController';

export async function managePokemons(event: Event, context: Context) {
  const validatePathParametersController = new ValidatePathParametersController(
    event,
    [pokemonPathParametersSchema],
  );

  return await validatePathParametersController.execute();
}
