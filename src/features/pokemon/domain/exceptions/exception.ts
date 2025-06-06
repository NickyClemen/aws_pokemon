abstract class Exception extends Error {
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }

  abstract getError(): UnionExceptionResponse;
}

type ExceptionResponse = {
  name: string;
  statusCode: number;
  message: string | Record<string, unknown>;
};

type AwsClientExceptionResponse = {
  type: string;
  message: string;
  statusName: string;
  statusCode: number | string;
};

type DynamoClientExceptionResponse = {
  type: string;
  message: string;
  requestId: string;
  statusCode: number;
  statusName: string;
};

type UnionExceptionResponse =
  | ExceptionResponse
  | AwsClientExceptionResponse
  | DynamoClientExceptionResponse;

export {
  Exception,
  ExceptionResponse,
  AwsClientExceptionResponse,
  DynamoClientExceptionResponse,
};
