# AWS Pókemon API

API Restful dedicada a la consulta de pokemons por nombre.

## Tecnologías Utilizadas

| Categoría       | Tecnologías                               |
| --------------- | ----------------------------------------- |
| Backend         | NodeJS + Typescript                       |
| Infraestructura | Serverless Framework                      |
| AWS             | Lambda, API Gateway, DynamoDB, CloudWatch |
| Testing         | Postman, Jest                             |

## Diagrama de Arquitectura

![Pokemon API Diagrama](https://github.com/NickyClemen/aws_pokemon/blob/main/assets/pokemon.png?raw=true)

## Componentes

El módulo se encuentra compuesto por los siguientes componentes:

### Middlewares

Validación de parámetros de la request. No acepta valores vacíos ni alfanuméricos. Esto se realiza utilizando Joi.

### DynamoDB

Base de datos **searchedPokemons**.

### Lambdas

#### getPokemonByName

Lambda que expone un endpoint HTTP/GET. Recibe por pathParameter el nombre del pókemon, con el cuál ejecuta las siguientes operaciones:

- Permisos de lectura sobre la base de datos de DynamoDB.
  - Si encuentra el registro, lo retorna junto a un status 200.
  - Si no lo encuentra, invoca la lambda managePokemons, retornando la 200 (junto al pokemon), 404 o el error correspondiente.

#### managePokemons

Expone un endpoint HTTP/POST sólo con fines de cumplir con requerimientos.

- Realiza consultas a PokeAPI (api externa) para obtener los datos de pokemons que no se encuentren guardados en DynamoDB.
- Permisos de escritura sobre la base de datos.
  - Se guardan las búsquedas realizadas a api externa.

El proyecto cuenta con collection de Postman para realizar las pruebas funcionales en los siguientes endpoints:

| Método | Endpoint                                                                        |
| ------ | ------------------------------------------------------------------------------- |
| GET    | `https://hxwoa737oi.execute-api.us-east-1.amazonaws.com/pokemons/{pokemonName}` |
| POST   | `https://hxwoa737oi.execute-api.us-east-1.amazonaws.com/pokemons/{pokemonName}` |

También puede ejecutarse con cURL:

```bash
curl -X GET \
  https://hxwoa737oi.execute-api.us-east-1.amazonaws.com/pokemons/pikachu \
  -H "Content-Type: application/json"
```

### Prerequisitos

- AWS CLI (tener configurado un profile de AWS)
- Serverless Framework

### Instalación

#### En caso de no tener cargadas las credenciales de AWS

`aws configure`

#### Instalar dependencias

`yarn`
`npm install`

#### Deploy

`sls deploy --aws-profile {{profile}} --stage {{stage}}`

#### Unit testing

`yarn test`
`npm test`

### Deuda técnica

- Mapear los imports en tsconfig para mejorar legibilidad.
- Agregar unit testing específicos por clase. Se realizaron los necesarios para comprobar la integración (el testing del módulo se realizó de manera funcional con Postman).
- Legibilidad del árbol de directorios. Aplicar correctamente patrones de arquitectura limpia.
- Agregar interfaces para los servicios del dominio Pokemon (GetPokemon, etc).
- Mejora y tipado de las responses de las lambdas.
- Observabilidad de los procesos de las functions.
- Agregar control de versiones (CHANGELOG.md).
- Variables de entorno por stage.
- Agregar Github Actions.
- husky para correr comandos de precommit, etc.
