import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

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
      throw error;
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
    return client;
  }

  commit(client: PoolClient) {
    return client.query('COMMIT');
  }

  rollback(client: PoolClient) {
    return client.query('ROLLBACK');
  }
}
