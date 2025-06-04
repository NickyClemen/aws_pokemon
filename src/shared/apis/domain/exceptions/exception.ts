class Exception extends Error {
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }
}

type ExceptionResponse = {
  name: string;
  statusCode: number;
  message: string | Record<string, unknown>;
};

export { Exception, ExceptionResponse };
