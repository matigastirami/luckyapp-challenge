DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS country;

CREATE TABLE IF NOT EXISTS country(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS city (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	countryId INT,
	CONSTRAINT fk_city_to_country
      FOREIGN KEY (countryId) 
	  REFERENCES country(id)
);

CREATE TABLE IF NOT EXISTS address(
	id SERIAL PRIMARY KEY,
	street VARCHAR(100),
	cityId INT,
	CONSTRAINT fk_address_to_city
      FOREIGN KEY (cityId) 
	  REFERENCES city(id)
);

CREATE TABLE IF NOT EXISTS "user"(
	id SERIAL PRIMARY KEY,
	username VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS profile(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	userId INT,
	addressId INT,
	CONSTRAINT fk_profile_to_user
      FOREIGN KEY (userId) 
	  REFERENCES "user"(id),
	CONSTRAINT fk_profile_to_address
      FOREIGN KEY (addressId) 
	  REFERENCES address(id)
);