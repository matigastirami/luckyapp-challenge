import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import ServiceError from '../../helper/service-error';
import { ErrorType } from '../../helper/types';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  private getConnection(trx): Promise<PoolClient> {
    if (trx) {
      return trx as Promise<PoolClient>;
    }

    return this.pool.connect();
  }

  async executeQuery(
    queryText: string,
    values: any[] = [],
    trx?: PoolClient,
  ): Promise<any[]> {
    const client = await this.getConnection(trx);

    this.logger.debug(`Executing query: ${queryText} (${values})`);

    try {
      const res = await client.query(queryText, values);
      this.logger.debug(`Query successfully executed`);
      return res.rows;
    } catch (error) {
      this.logger.error(`Error on execute query`);
      throw new ServiceError(
        ErrorType.CONNECTION,
        `Internal server error`,
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
        [
          {
            issue: 'INTERNAL_SERVER_ERROR',
            description: `Internal server error`,
          },
        ],
      );
    } finally {
      if (!trx) {
        this.logger.debug(`Releasing client`);
        client.release();
      }
    }
  }

  async startTransaction() {
    const client = await this.pool.connect();
    await client.query('BEGIN');
    this.logger.log(`DB Transaction started`);
    return client;
  }

  commit(client: PoolClient) {
    this.logger.log(`DB Transaction succeed`);
    return client.query('COMMIT');
  }

  rollback(client: PoolClient) {
    this.logger.log(`DB Transaction failed`);
    return client.query('ROLLBACK');
  }
}
