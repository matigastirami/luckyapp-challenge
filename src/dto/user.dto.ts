import {
  IsString,
  IsInt,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { isUserNameTaken } from '../validators/user.validator';

export class CreateUserAddressDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  street: string;

  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  cityId: number;
}

export class CreateUserDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @isUserNameTaken({ message: 'Username already taken' })
  username: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address: CreateUserAddressDto;
}

export interface IGetUserAddressResponse {
  street: string;
  city: string;
  country: string;
}

export interface IGetUserResponse {
  id: number;
  name: string;
  address: IGetUserAddressResponse;
}
