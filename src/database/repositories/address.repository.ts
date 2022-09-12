import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface IAddress {
  id: number;
  name: string;
  cityId: string;
}

export class AddressRepository implements BaseRepository<IAddress> {
  constructor(private readonly _databaseService: DatabaseService) {}

  getById(id: number): Promise<IAddress> {
    return this._databaseService.executeQuery(
      `SELECT id, name
        FROM address
        WHERE id = $1;`,
      [id],
    )[0];
  }

  getByCity(countryId): Promise<IAddress> {
    return this._databaseService.executeQuery(
      `SELECT id, name, city_id
        FROM address
        WHERE city_id = $1;`,
      [countryId],
    )[0];
  }
}
