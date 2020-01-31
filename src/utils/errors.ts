// eslint-disable-next-line max-classes-per-file
export class ServerUnreachableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ServerUnreachableError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class FormValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'FormValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
