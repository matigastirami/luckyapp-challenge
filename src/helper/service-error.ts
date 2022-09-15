import { ErrorType } from './types';

export default class ServiceError extends Error {
  constructor(type, message, code, status, details) {
    super(message);
    this.type = type;
    this.message = message;
    this.status = status;
    this.code = code;
    this.details = details;
  }

  type: ErrorType;
  status: number;
  code: string;
  details?: Array<any>;
}
