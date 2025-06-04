interface ResponseMapper<T> {
  status: number;
  requestId: string;
  item?: T;
}

export { ResponseMapper };
