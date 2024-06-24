# Xero Integration

## How to run using docker image from Docker Hub.

To build and run the Docker image from your Docker Hub repository locally, you can follow these steps:

1. **Pull the Docker Image**: Pull the pre-built Docker image from Docker Hub.
2. **Run the Docker Container**: Run the Docker container using the pulled image.

Here’s the step-by-step process:

### Step 1: Pull the Docker Image

Open a terminal (or Command Prompt) and pull the Docker image from Docker Hub using the following command:

```sh
docker pull darshanshahdev/xero-integration:latest
```

### Step 2: Create a `.env` File

Ensure you have a `.env` file in your project directory. This file should contain all the necessary environment variables. For example:

```plaintext
PORT=5000
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret
XERO_REDIRECT_URI=your-xero-redirect-uri
```

### Step 3: Run the Docker Container

Run the Docker container using the pulled image and the environment variables from the `.env` file:

```sh
docker run --env-file .env -p 5000:5000 darshanshahdev/xero-integration:latest
```

### Optional: Use Docker Compose

If you prefer using Docker Compose, you can create a `docker-compose.yml` file to manage your services. Here is an example of how to set it up:

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    container_name: xero-integration-container
    image: darshanshahdev/xero-integration:latest
    ports:
      - "5000:5000"
    env_file:
      - .env
```

### Running with Docker Compose

To use Docker Compose, follow these steps:

1. **Create a `docker-compose.yml` file**: Use the example above.

2. **Run Docker Compose**:

   ```sh
   docker-compose up
   ```

### Summary

1. **Pull the Docker image**:

   ```sh
   docker pull darshanshahdev/xero-integration:latest
   ```

2. **Create a `.env` file**: Ensure it contains all the required environment variables.

3. **Run the Docker container**:

   ```sh
   docker run --env-file .env -p 3000:3000 darshanshahdev/xero-integration:latest
   ```

4. **Optional: Use Docker Compose**: Create a `docker-compose.yml` file and run:

   ```sh
   docker-compose up
   ```

By following these steps, you should be able to build and run the Docker image from your Docker Hub repository locally.