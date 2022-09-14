import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface ICity {
  id: number;
  name: string;
  countryId: number;
}

@Injectable()
export class CityRepository implements BaseRepository<ICity> {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getById(id: number, trx?: PoolClient): Promise<ICity> {
    return (
      await this._databaseService.executeQuery(
        `SELECT id, name
        FROM city
        WHERE id = $1;`,
        [id],
        trx,
      )
    )[0];
  }

  getByCountry(countryId, trx?: PoolClient): Promise<ICity> {
    return this._databaseService.executeQuery(
      `SELECT id, name, country_id
          FROM city
          WHERE country_id = $1;`,
      [countryId],
      trx,
    )[0];
  }
}
