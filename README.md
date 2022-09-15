# Lucky App challenge
This is NestJS service

## Running docker compose
* Start only the essential services (API + PSQL + Redis)
`docker-compose up --build server -d`

* Start both essential services and secondary ones (pgAdmin and Redis commander)
`docker-compose up --build -d`

## Testing
Tests are not currently running in the container so make sure you execute `npm install` before proceeding with the next steps.

### E2E tests
`npm run test:e2e`

# Assumptions

* In the GET /user route, as it was not clear, I did not pass the :id parameter in the url, I'm using the id in the access token instead. I created a custom decorator for this.
* For the address, I create a new one every time a new user request is received as it's not clear if having the same street name is enough to consider an existing address.
