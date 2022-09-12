import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface ICity {
  id: number;
  name: string;
  countryId: string;
}

export class CityRepository implements BaseRepository<ICity> {
  constructor(private readonly _databaseService: DatabaseService) {}

  getById(id: number): Promise<ICity> {
    return this._databaseService.executeQuery(
      `SELECT id, name
        FROM city
        WHERE id = $1;`,
      [id],
    )[0];
  }

  getByCountry(countryId): Promise<ICity> {
    return this._databaseService.executeQuery(
      `SELECT id, name, country_id
          FROM city
          WHERE country_id = $1;`,
      [countryId],
    )[0];
  }
}
