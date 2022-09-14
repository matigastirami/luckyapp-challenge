import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddressRepository } from 'src/database/repositories/address.repository';
import { CityRepository } from 'src/database/repositories/city.repository';
import { CountryRepository } from 'src/database/repositories/country.repository';
import { ProfileRepository } from 'src/database/repositories/profile.repository';
import {
  IGetUserResponse,
  IUser,
  UserRepository,
} from 'src/database/repositories/user.repository';
import { CreateUserDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
    private readonly cityRepository: CityRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    const {
      username,
      password,
      name,
      address: { cityId, street },
    } = createUserDto;

    const trx = await this.databaseService.startTransaction();
    try {
      const user = await this.userRepository.create(
        { username, password },
        trx,
      );

      const existingAddress = await this.addressRepository.getByStreet(
        street,
        trx,
      );

      // If the address already exists for the informed city
      if (existingAddress && existingAddress.cityId === cityId) {
        await this.profileRepository.create(
          {
            addressId: existingAddress.id,
            name,
            userId: user.id,
          },
          trx,
        );
      }

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

      this.logger.log('User created succesfully');

      return user;
    } catch (error) {
      this.logger.error('Error on user creation');
      await this.databaseService.rollback(trx);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      trx.release();
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<IGetUserResponse> {
    const trx = await this.databaseService.startTransaction();
    try {
      const userProfile = await this.profileRepository.getByUser(id, trx);

      if (!userProfile) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      }

      const { name, addressId } = userProfile;

      const { cityId, street } = await this.addressRepository.getById(
        addressId,
        trx,
      );
      const { name: cityName, countryId } = await this.cityRepository.getById(
        cityId,
        trx,
      );
      const { name: countryName } = await this.countryRepository.getById(
        countryId,
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
      console.log('Error on GET user', error);
      await this.databaseService.rollback(trx);
      throw error;
    } finally {
      trx.release();
    }
  }
}
