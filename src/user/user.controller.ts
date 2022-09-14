import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddressRepository } from 'src/database/repositories/address.repository';
import { ProfileRepository } from 'src/database/repositories/profile.repository';
import {
  IUser,
  UserRepository,
} from 'src/database/repositories/user.repository';
import { CreateUserDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
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

      const existingAddress = await this.addressRepository.getByStreet(street);

      // If the address already exists for the informed city
      if (existingAddress && existingAddress.cityId === cityId) {
        await this.profileRepository.create({
          addressId: existingAddress.id,
          name,
          userId: user.id,
        });
      }

      const newAddress = await this.addressRepository.create({
        street,
        cityId,
      });

      await this.profileRepository.create({
        addressId: newAddress.id,
        name,
        userId: user.id,
      });

      await this.databaseService.commit(trx);
      return user;
    } catch (error) {
      console.log('Error on POST user', error);
      await this.databaseService.rollback(trx);
    } finally {
      trx.release();
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<IUser> {
    const trx = await this.databaseService.startTransaction();
    try {
      const user = await this.userRepository.getById(id, trx);
      await this.databaseService.commit(trx);
      console.log('User from DB', user);
      return user;
    } catch (error) {
      console.log('Error on GET user', error);
      await this.databaseService.rollback(trx);
    } finally {
      trx.release();
    }
  }
}
