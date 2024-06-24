# Xero Integration

This repository contains a Node.js application that integrates with Xero, a cloud-based accounting software. The application provides various functionalities to interact with Xero's API.

## Features

- Authentication with Xero
- Fetching data from Xero
- Handling Xero webhooks
- Environment configuration using `.env` file

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v20 or higher)
- npm (Node Package Manager)
- Docker (optional, for containerization)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Darshan1510/xero-integration.git
   cd xero-integration

2. **Install dependencies:**

    ```
    npm install

3. **Set up environment variables:**

    Create a .env file in the root directory and add the required environment variables. Here is an example:

    ```
    PORT=5000
    XERO_CLIENT_ID=your-xero-client-id
    XERO_CLIENT_SECRET=your-xero-client-secret
    XERO_REDIRECT_URI=your-xero-redirect-uri

## Usage

### Running the Application:
To run the application locally, use the following command:

    npm start

The application will start on the port specified in the .env file (default is 5000).

## Using Docker

### To containerize the application using Docker, follow these steps:

1. **Build the Docker image:**

    ```
    docker build -t xero-integration .

2. **Run the Docker container:**

    ```
    docker run --env-file .env -p 5000:5000 xero-integration

## Using Docker Compose

### To run the application with Docker Compose:

    docker-compose up

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you would like to contribute to this project.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or issues, please contact me. 