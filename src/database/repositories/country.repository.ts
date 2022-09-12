import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface ICountry {
  id: number;
  name: string;
}

export class CountryRepository implements BaseRepository<ICountry> {
  constructor(private readonly _databaseService: DatabaseService) {}

  getById(id: number): Promise<ICountry> {
    return this._databaseService.executeQuery(
      `SELECT id, name
        FROM country
        WHERE id = $1;`,
      [id],
    )[0];
  }
}
