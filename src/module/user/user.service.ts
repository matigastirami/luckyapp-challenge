import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import ServiceError from '../../helper/service-error';
import { ErrorType } from '../../helper/types';
import { DatabaseService } from '../database/database.service';
import { AddressRepository } from '../database/repositories/address.repository';
import { CityRepository } from '../database/repositories/city.repository';
import { CountryRepository } from '../database/repositories/country.repository';
import { ProfileRepository } from '../database/repositories/profile.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { CreateUserDTO, IGetUserResponse } from '../../dto/user.dto';
import Hash from '../../helper/hash';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
    private readonly cityRepository: CityRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    const {
      username,
      password,
      name,
      address: { cityId, street },
    } = createUserDto;

    const trx = await this.databaseService.startTransaction();
    try {
      const user = await this.userRepository.create(
        { username, password: await Hash.hashString(password) },
        trx,
      );

      const newAddress = await this.addressRepository.create(
        {
          street,
          cityId,
        },
        trx,
      );

      await this.profileRepository.create(
        {
          addressId: newAddress.id,
          name,
          userId: user.id,
        },
        trx,
      );

      await this.databaseService.commit(trx);

      this.logger.log('User created successfully');

      return user;
    } catch (error) {
      this.logger.error('Error on user creation');
      await this.databaseService.rollback(trx);
      throw new ServiceError(
        ErrorType.BUSINESS,
        `Error trying to create an user`,
        'BAD_REQUEST',
        HttpStatus.BAD_REQUEST,
        [
          {
            issue: 'BAD_REQUEST',
            description: `Error trying to create an user`,
          },
        ],
      );
    } finally {
      trx.release();
    }
  }

  async getUser(id: number): Promise<IGetUserResponse> {
    const trx = await this.databaseService.startTransaction();
    try {
      const userProfile = await this.profileRepository.getByUser(id, trx);

      if (!userProfile) {
        throw new ServiceError(
          ErrorType.BUSINESS,
          `User not found`,
          'NOT_FOUND',
          HttpStatus.NOT_FOUND,
          [
            {
              issue: 'NOT_FOUND',
              description: `User not found`,
            },
          ],
        );
      }

      const { name, addressid } = userProfile;

      const { cityid, street } = await this.addressRepository.getById(
        addressid,
        trx,
      );
      const { name: cityName, countryid } = await this.cityRepository.getById(
        cityid,
        trx,
      );

      const { name: countryName } = await this.countryRepository.getById(
        countryid,
        trx,
      );
      await this.databaseService.commit(trx);

      return {
        id,
        name,
        address: {
          street,
          city: cityName,
          country: countryName,
        },
      };
    } catch (error) {
      this.logger.error('Error on user fetch');
      await this.databaseService.rollback(trx);
      throw new ServiceError(
        ErrorType.BUSINESS,
        `Error trying to fetch an user`,
        'BAD_REQUEST',
        HttpStatus.BAD_REQUEST,
        [
          {
            issue: 'BAD_REQUEST',
            description: `Error trying to fetch an user`,
          },
        ],
      );
    } finally {
      trx.release();
    }
  }
}
