import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';

interface IAddress {
  id: number;
  street: string;
  cityId: number;
}

export interface ICreateAddress {
  street: string;
  cityId: number;
}

@Injectable()
export class AddressRepository implements BaseRepository<IAddress> {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getById(id: number, trx?: PoolClient): Promise<IAddress> {
    return (
      await this._databaseService.executeQuery(
        `SELECT id, street, cityId
        FROM address
        WHERE id = $1;`,
        [id],
        trx,
      )
    )[0];
  }

  async getByCity(countryId, trx?: PoolClient): Promise<IAddress> {
    return (
      await this._databaseService.executeQuery(
        `SELECT id, street, cityId
        FROM address
        WHERE cityId = $1;`,
        [countryId],
        trx,
      )
    )[0];
  }

  async getByStreet(street, trx?: PoolClient): Promise<IAddress> {
    return (
      await this._databaseService.executeQuery(
        `SELECT id, street, cityId
        FROM address
        WHERE street = $1;`,
        [street],
        trx,
      )
    )[0];
  }

  async create(data: ICreateAddress, trx?: PoolClient): Promise<IAddress> {
    const { street, cityId } = data;
    return (
      await this._databaseService.executeQuery(
        `
        INSERT INTO address (street, cityId)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [street, cityId],
        trx,
      )
    )[0];
  }
}
