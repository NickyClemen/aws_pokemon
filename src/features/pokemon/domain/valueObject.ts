export class ValueObject<T> {
  constructor(protected readonly value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}
