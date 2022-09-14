export class CreateUserAddressDto {
  street: string;
  cityId: number;
}

export class CreateUserDTO {
  username: string;
  password: string;
  name: string;
  address: CreateUserAddressDto;
}
