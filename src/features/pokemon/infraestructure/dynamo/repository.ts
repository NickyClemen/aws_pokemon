import { ResponseMapper } from './responseMapper';

export interface IRepository<T> {
  getItem(input: Partial<T>): Promise<ResponseMapper<T>>;
  putItem(input: T): Promise<ResponseMapper<T>>;
}
