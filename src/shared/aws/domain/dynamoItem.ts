import { ValueObject } from './valueObject';

interface DynamoTypeParams<T> {
  table: string;
  body: T;
  dynamoType: 'Key' | 'Item';
}

export class DynamoItem<T> extends ValueObject<DynamoTypeParams<T>> {
  constructor(readonly value: DynamoTypeParams<T>) {
    super(value);
  }

  valueMapper() {
    const { table, dynamoType, body } = this.value;

    return {
      TableName: table,
      [dynamoType]: Object.entries(body).reduce((accum, entry) => {
        const [key, value] = entry;
        accum[key] = {
          S: typeof value === 'object' ? JSON.stringify(value) : value,
        };

        return accum;
      }, {}),
    };
  }
}
