import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    this.logger.debug(`Executing query: ${queryText} (${values})`);
    return this.pool.query(queryText, values).then((result: QueryResult) => {
      this.logger.debug(`Executed query, result size ${result.rows.length}`);
      return result.rows;
    });
  }

  async startTransaction() {
    const client = await this.pool.connect();
    await client.query('BEGIN');
  }

  commit(client: PoolClient) {
    return client.query('COMMIT');
  }

  rollback(client: PoolClient) {
    return client.query('ROLLBACK');
  }
}
