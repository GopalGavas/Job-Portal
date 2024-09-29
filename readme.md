# Job Management API

This API allows you to manage job postings, including creating, retrieving, updating, and deleting job entries. It is designed for job seekers and employers to interact with job listings effectively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create, read, update, and delete job postings.
- Filter job postings by application status and work type.
- Search for jobs by position.
- Sort job postings.

## Technologies Used

- Node.js
- Express
- MongoDB (or any database you are using)
- Swagger for API documentation
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js
- MongoDB (or other databases as per your setup)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GopalGavas/Job-Portal.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Documentation

API documentation is available at: [API Documentation Link](https://job-portal-a4px.onrender.com/docs)

## Endpoints

### User API

- Create User: POST /api/v1/user/register
- Login: POST /api/v1/user/login
- Logout: POST /api/v1/user/logout
- Update User: PATCH /api/v1/user/update-details
- Change Password: PATCH /api/v1/user/change-password
- Refresh Token: POST /api/v1/user/refresh-token

### Jobs API

- Create Job: POST /api/v1/job/create-job
- Get Jobs: GET /api/v1/job/get-job
- Update Job: PATCH /api/v1/job/update-job/:jobId
- Delete Job: DELETE /api/v1/job/delete-job/:jobId
- Get Job Stats: GET /api/v1/job/stats

## Contributing

If you wish to contribute to this project, please feel free to contribute.

## License

This project is licensed under [TechinfoYt](https://www.youtube.com/@TechinfoYT)
