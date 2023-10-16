# one-time-secret-app

## Summary

An application that enables users to share secrets accessible only once, integrating technologies like GitHub, Docker, and a preferred database.

## Acceptance Criteria

### Application Development

- The application is containerized using Docker.
- The application is developed in either JavaScript or TypeScript. (TypeScript is preferred.)
- MongoDB or MySQL is chosen as the database, with MongoDB being the preferred choice.

### One-Time Secret Application Features

- A user interface allows for secret message input.
- Upon submission, a unique link is generated for the user.
- Accessing the link reveals the secret message only once. Subsequent access attempts should either show an error or indicate the message has been viewed.
- Implement secure storage and handling of secret messages.

## Steps to build and run the basic app

```bash
docker-compose up --build
```

[Click here to view the app](http://localhost:3000/) and see "Hello World!".

## TODOS:
### Application Development:
#### a. Containerization:
- Write necessary commands in the Dockerfile and docker-compose to build and run the application within a Docker container.
- The front end can be done in React or another JS framework.

#### b. Database Setup:
- Choose and set up a database (preferably MongoDB).
- Expand the `docker-compose.yml` file to orchestrate the application and database containers.

#### c. Implement Application Features:
- Develop the necessary endpoints, services, and frontend to meet the acceptance criteria mentioned in the summary.

#### d. Testing:
- Write tests using Jest to cover the functionality of the application.
- Ensure that all tests pass and that the application meets the acceptance criteria.

### Documentation:
#### a. Update README:
- Document the setup process, how to run the application, how to run tests, and provide information about the implemented features.

#### b. Code Comments:
- Ensure the code is well-commented to explain the logic, especially for the core features of the one-time secret application.

### Contributing Code via Pull Request:
- Commit your changes and push them to your feature branch on GitHub. Create a pull request targeting the main branch for review.
