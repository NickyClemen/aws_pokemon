import { Event } from 'aws-lambda';

export const event: Event = {
  body: null,
  cookies: [],
  headers: {
    'user-agent': 'PostmanRuntime/7.44.0',
    accept: '*/*',
    'cache-control': 'no-cache',
    'postman-token': 'ccf0326b-7b67-493a-80a6-e21f5c916a3e',
    host: 'localhost:3000',
    'accept-encoding': 'gzip, deflate, br',
    connection: 'keep-alive',
    'content-length': '0',
  },
  isBase64Encoded: false,
  pathParameters: {
    pokemonName: 'pikachu',
  },
  queryStringParameters: null,
  rawPath: '/pokemons/pikachu',
  rawQueryString: '',
  requestContext: {
    accountId: 'offlineContext_accountId',
    apiId: 'offlineContext_apiId',
    domainName: 'offlineContext_domainName',
    domainPrefix: 'offlineContext_domainPrefix',
    http: {
      method: 'POST',
      path: '/pokemons/pikachu',
      protocol: 'HTTP/1.1',
      sourceIp: '127.0.0.1',
      userAgent: 'PostmanRuntime/7.44.0',
    },
    requestId: 'offlineContext_resourceId',
    routeKey: 'POST /pokemons/{pokemonName}',
    stage: '$default',
    time: '02/Jun/2025:16:50:50 +0000',
    timeEpoch: 1748883050288,
  },
  routeKey: 'POST /pokemons/{pokemonName}',
  stageVariables: null,
  version: '2.0',
} as Event;
