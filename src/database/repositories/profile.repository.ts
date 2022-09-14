import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface IProfile {
  id: number;
  userId: string;
  addressId: string;
  name: string;
}

export interface ICreateProfile {
  name: string;
  addressId: number;
  userId: number;
}

@Injectable()
export class ProfileRepository implements BaseRepository<IProfile> {
  constructor(private readonly _databaseService: DatabaseService) {}
  async getById(id: number, trx?: PoolClient): Promise<IProfile> {
    const result = (
      await this._databaseService.executeQuery(
        `SELECT id, userId, name, addressId
          FROM profile
          WHERE id = $1;`,
        [id],
        trx,
      )
    )[0];

    return result;
  }

  getByUser(countryId, trx?: PoolClient): Promise<IProfile> {
    return this._databaseService.executeQuery(
      `SELECT id, userId, name, addressId
        FROM profile
        WHERE city_id = $1;`,
      [countryId],
      trx,
    )[0];
  }

  async create(data: ICreateProfile, trx?: PoolClient): Promise<IProfile> {
    const { addressId, name, userId } = data;
    return (
      await this._databaseService.executeQuery(
        `
      INSERT INTO profile (name, userId, addressId)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
        [name, userId, addressId],
        trx,
      )
    )[0];
  }
}
