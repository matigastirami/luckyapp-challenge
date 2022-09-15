import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

const logger = new Logger('ErrorLogger');

// TODO: Extend the functionality to log errors in a DB and return a reference code for contacting support
const logError = (err) => {
  logger.error(err['message'], null);
};

const handleError = (err, status) => {
  const { name, errors } = err;
  const currentTimestamp = new Date().toISOString();
  const obj = {
    statusCode: status,
    timestamp: currentTimestamp,
  };

  if (name && name === 'MongoError') {
    const duplicatedKeys = Object.keys(err.keyValue).map((key) => key);

    return {
      ...obj,
      code: mapPostgresErrorCode[err.code][0],
      message: `The value ${err.keyValue.code} already exists`,
      details: [
        {
          issue: 'DUPLICATED_KEY',
          description: `The value/s sent in the parameter/s: (${duplicatedKeys.join(
            ',',
          )}) are duplicated`,
        },
      ],
    };
  } else if (errors) {
    const missingKeys = Object.keys(errors);

    return {
      ...obj,
      code: 'MISSING_REQUIRED_PARAMETERS',
      message: `The parameter/s ${missingKeys.join(',')} are required`,
      details: missingKeys.map((key) => ({
        issue: 'MISSING_PARAMETER',
        description: `The parameter ${key} is required`,
      })),
    };
  }

  return {
    ...obj,
    details: err['details'] ?? [],
    code: err['code'] ?? 'UNKNOWN',
    message: err['message'] ?? mapStatusCodeToMessage[status],
  };
};

const mapPostgresErrorCode = {
  23503: ['INVALID_ID', HttpStatus.BAD_REQUEST],
  23505: ['DUPLICATED_ENTRY', HttpStatus.BAD_REQUEST],
};

const getStatusCode = (err) => {
  const { name, status } = err;

  if (name && name === 'MongoError') {
    return mapPostgresErrorCode[err.code][1];
  }

  return status ?? HttpStatus.INTERNAL_SERVER_ERROR;
};

/*
 * This class is used to centralize the exception handling in one place
 */
@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = getStatusCode(exception);

    logError(exception);

    response.status(status).json({
      path: request.url,
      ...handleError(exception, status),
    });
  }
}
