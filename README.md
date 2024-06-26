# one-time-secret-app

## Done

Done almost everything, except configuring docker-compose.yml as this is where I just don't have enough experience.

### Implemented:

- Added frontend: Vuejs 3 + TypeScript.
- Changed backend to TypeScript.
- Implemented message encryption/decryption.
- Messages are stored encrypted in MongoDB.
- Implemented a few tests in Jest. Covered the main aspects of encryption. Ideally needs more unit tests.

### Workflow

The encryption workflow is as follows:

- User types in a message on the front endand clicks "Encrypt" button.
- The message is sent to the backend endpoint via a POST request.
- Backend encrypts the message, saves it to the database, and returns onto the client the db record id and the encryption key. The record is stored in the database without the key.
- The frontend presents the user with link to decrypt the message.
- The link contains the record id and the key.
- The link opens a different page on the frontend, which send the decryption request to the backend.
- Backend receives the record id and the key. If the record exists and the decryption is successful, the decrypted message is returned. Otherwise a corresponding error is returned. The record is deleted if it was successfully decrypted. Race condition check is implemented to ensure only one request is be fulfilled successfully.
- The front end displays either the decrypted message or an error.
- Repetition of the decryption request results in the "Message not found" error.

### Running

Since I didn’t get to implement docker-compose.yml, the services need to be started manually.

Frontend start:
```bash
cd frontend
npm run dev
```

Backend start:
```bash
npx ts-node src/index.ts
```

Mongo can be installed using a docker image (I already happened to be running one installed the same way earlier):
```bash
docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

Then in the browser navigate to the message encryption interface
http://localhost:5173/create

To run unit tests of the backend, it needs to be down, and the jest tests can be run with a command:
```bash
npm run test
```

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
