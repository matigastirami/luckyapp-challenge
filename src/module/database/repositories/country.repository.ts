import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database.service';
import { ICountry } from '../models/country.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CountryRepository implements BaseRepository<ICountry> {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getById(id: number, trx?: PoolClient): Promise<ICountry> {
    return (
      await this._databaseService.executeQuery(
        `SELECT id, name
        FROM country
        WHERE id = $1;`,
        [id],
        trx,
      )
    )[0];
  }
}
