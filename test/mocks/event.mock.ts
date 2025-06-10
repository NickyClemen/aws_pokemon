import { APIGatewayProxyEvent } from 'aws-lambda';

const event: (method: string) => APIGatewayProxyEvent = (
  method: string,
): APIGatewayProxyEvent => {
  return {
    version: '2.0',
    routeKey: `${method} /pokemons/{pokemonName}`,
    rawPath: '/pokemons/pikachu',
    rawQueryString: method,
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'cache-control': 'no-cache',
      'content-length': '0',
      host: 'hxwoa737oi.execute-api.us-east-1.amazonaws.com',
      'postman-token': '5866a1c7-50d1-4e14-bdc3-5c314bc4b008',
      'user-agent': 'PostmanRuntime/7.44.0',
      'x-amzn-trace-id': 'Root=1-68485215-1c501bfb4d761e510bd4fe6c',
      'x-forwarded-for': '181.26.9.148',
      'x-forwarded-port': '443',
      'x-forwarded-proto': 'https',
    },
    requestContext: {
      accountId: '218586438768',
      apiId: 'hxwoa737oi',
      domainName: 'hxwoa737oi.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'hxwoa737oi',
      http: {
        method: method,
        path: '/pokemons/pikachu',
        protocol: 'HTTP/1.1',
        sourceIp: '181.26.9.148',
        userAgent: 'PostmanRuntime/7.44.0',
      },
      requestId: 'L9HDah8VoAMEbtQ=',
      routeKey: `${method} /pokemons/{pokemonName}`,
      stage: '$default',
      time: '10/Jun/2025:15:41:09 +0000',
      timeEpoch: 1749570069436,
    },
    pathParameters: {
      pokemonName: 'pikachu',
    },
    isBase64Encoded: false,
  } as unknown as APIGatewayProxyEvent;
};

const getEvent: APIGatewayProxyEvent = event('GET');
const postEvent: APIGatewayProxyEvent = event('POST');

export { getEvent, postEvent };
