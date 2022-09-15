import { PoolClient } from 'pg';

export interface BaseRepository<T> {
  getById(id: number, trx?: PoolClient): Promise<T>;
  getAll?(trx?: PoolClient): Promise<T[]>;
  create?(data, trx?: PoolClient): Promise<T>;
  update?(data, trx?: PoolClient): Promise<T>;
  delete?(data, trx?: PoolClient): Promise<T>;
}
