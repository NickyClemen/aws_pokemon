import { event } from '../../mocks/event.mock';

import { pokemonPathParametersSchema } from '../../../src/lambdas/validatePathParameters/schemas/pokemonPathParameters';
import { ValidatePathParametersController } from '../../../src/lambdas/validatePathParameters/infraestructure/validatePathParametersController';

describe('[SUCESS] ValidatePathParametersController', () => {
  const validatePathParametersController: ValidatePathParametersController =
    new ValidatePathParametersController(event, [pokemonPathParametersSchema]);

  test('should be defined', () => {
    expect(validatePathParametersController).toBeDefined();
  });

  test('should have execute function', () => {
    expect(typeof validatePathParametersController.execute).toBe('function');
  });

  test('should status 200', () => {
    const response = validatePathParametersController.execute();
    expect(response.statusCode).toBe(200);
  });
});

describe('[ERRORS] ValidatePathParametersController', () => {
  let validatePathParametersController: ValidatePathParametersController;

  test('[400] event withouth parameters', async () => {
    validatePathParametersController = new ValidatePathParametersController(
      {
        ...event,
        pathParameters: null,
      },
      [pokemonPathParametersSchema],
    );

    const response = await validatePathParametersController.execute();

    expect(response).toBeDefined();

    const { statusCode, body } = response;
    const parsedBody = JSON.parse(body);

    expect(statusCode).toBe(400);
    expect(parsedBody.errors[0]).toBe('Path parameters are required');
  });

  test('[400] event withouth pokemonName', async () => {
    validatePathParametersController = new ValidatePathParametersController(
      {
        ...event,
        pathParameters: {},
      },
      [pokemonPathParametersSchema],
    );

    const response = await validatePathParametersController.execute();

    expect(response).toBeDefined();

    const { statusCode, body } = response;
    const parsedBody = JSON.parse(body);

    expect(statusCode).toBe(400);
    expect(parsedBody.errors[0]).toBe('"pokemonName" is required');
  });
});
