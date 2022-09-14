import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

export interface IUser {
  id: number;
  username: string;
  password: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
}

@Injectable()
export class UserRepository implements BaseRepository<IUser> {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getById(id: number, trx?: PoolClient): Promise<IUser> {
    const result = (
      await this._databaseService.executeQuery(
        `SELECT id, username, password
        FROM "user"
        WHERE id = $1;`,
        [id],
        trx,
      )
    )[0];

    return result;
  }

  async create(data: CreateUserInput, trx?: PoolClient): Promise<IUser> {
    const { username, password } = data;
    return (
      await this._databaseService.executeQuery(
        `
        INSERT INTO "user" (username, password)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [username, password],
        trx,
      )
    )[0];
  }
}
