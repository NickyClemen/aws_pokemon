module.exports = {
  tables: [
    {
      TableName: `searchedPokemonsTable`,
      KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
};
