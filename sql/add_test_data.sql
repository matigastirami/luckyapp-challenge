INSERT INTO country (name)
VALUES ('ARGENTINA'), ('BRAZIL'), ('USA');

INSERT INTO city (countryid, "name")
SELECT id, CONCAT(country."name", '_RANDOM_CITY') FROM country;