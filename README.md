# Album Tracker

Album Tracker is a versatile application designed for tracking albums using the Last.fm API. This tool allows users to
conveniently manage and monitor their favorite albums, providing a seamless experience for music enthusiasts.

### 1. Last.fm Integration

Album Tracker integrates seamlessly with the Last.fm API, allowing users to access a vast database of music information.
This ensures accurate and up-to-date details for the albums being tracked.

### 2. Album Tracking

Users can easily add and track their favorite albums. The application provides a user-friendly interface for managing
albums, including features such as adding, editing, and removing albums from the tracking list.

### 3. Comprehensive Album Details

Retrieve detailed information about each tracked album, including artist details, release date, genre, and album cover
art. This information is fetched from the Last.fm API to ensure accuracy.

### 4. Search Functionality

Efficiently search for new albums to track. The search functionality utilizes the Last.fm APIs search capabilities,
providing users with a diverse range of albums to discover and follow.

### 5. User Authentication

Ensure the security of user data with a robust authentication system. Users can create accounts, log in securely, and
manage their tracked albums across multiple sessions.

## API Reference

### Authentication

| Method | Endpoint          | Description              | Body                                                                                                | Auth   | Important notes                                                         |
|--------|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------|--------|-------------------------------------------------------------------------|
| POST   | `/auth/register`  | Register a new user      | `{ "email": "john.doe@gmail.com", "password": "password", "firstName": "John", "lastName": "Doe" }` |        | If duplicate email, it throws `duplicate key` error                     |
| POST   | `/auth/login`     | Log in an existing user  | `{ "email": "john.doe@gmail.com", "password": "password" }`                                         |        | If wrong email, throws `User not found` error, else `Unauthorized`error |

### Users

| Method | Endpoint        | Description      | Body  | Auth         | Important notes                                           |
|--------|-----------------|------------------|-------|--------------|-----------------------------------------------------------|
| GET    | `/user/profile` | Get user profile |       | Bearer token | If no token or invalid token, throws `Unauthorized` error |

### Albums

| Method | Endpoint                                            | Description        | Body                                                                                                                                           | Auth         | Important notes                                                  | 
|--------|-----------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------|--------------|------------------------------------------------------------------|
| GET    | `/album`                                            | Get all albums     |                                                                                                                                                | Bearer token |                                                                  |
| GET    | `/album/:id`                                        | Get album by ID    |                                                                                                                                                | Bearer token |                                                                  |
| GET    | `/album/last-fm/search?query=<query>`               | Search for albums  |                                                                                                                                                | Bearer token |                                                                  |
| GET    | `/album/last-fm/info?artist=<artist>&album=<album>` | Get album info     |                                                                                                                                                | Bearer token |                                                                  |
| GET    | `/album/last-fm/similar?artist=<artist>`            | Get similar albums |                                                                                                                                                | Bearer token |                                                                  |

### Artists

| Method | Endpoint                               | Description                    | Body                                                                                                                                           | Auth         | Important notes                                                  |
|--------|----------------------------------------|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|--------------|------------------------------------------------------------------|
| GET    | `/artist/last-fm/search?query=<query>` | Search for artists             |                                                                                                                                                | Bearer token |                                                                  |
| GET    | `/artist/last-fm/info?artist=<artist>` | Get artist info and top albums |                                                                                                                                                | Bearer token |                                                                  |

### Playlists (of albums)

| Method | Endpoint               | Description                  | Body                                      | Auth         | Important notes                            |
|--------|------------------------|------------------------------|-------------------------------------------|--------------|--------------------------------------------|
| GET    | `/playlist`            | Get all playlists            |                                           | Bearer token | ADMIN ONLY                                 |
| GET    | `/playlist/me/all`     | Get all playlists from user  |                                           | Bearer token |                                            |
| GET    | `/playlist/:id`        | Get playlist by ID           |                                           |              | Returns playlist with all albums           |
| PUT    | `/playlist/:id`        | Updates playlist by ID       | `{ "name": "Test" }`                      |              | Can update only name and description       |
| POST   | `/playlist`            | Creates playlist             | `{ "name": "Test", "description": "test"` | Bearer token | Creates a playlist with empty albums array |
| POST   | `/playlist/:id/albums` | Adds albums to playlist      | `{ "albumIds": [] }`                      | Bearer token |                                            |
| DELETE | `/playlist/:id/albums` | Removes albums from playlist | `{ "albumIds": [] }`                      | Bearer token |                                            |
| DELETE | `/playlist/:id`        | Delete playlist              |                                           | Bearer token |                                            |

## Getting Started

Follow these steps to get the Album Tracker up and running on your local machine:

### Prerequisites

- [Node JS v20.9.0](https://nodejs.org/en/download/).
- [Docker](https://www.docker.com/get-started).

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jeanbabtista/album-tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd album-tracker
    ```

3. Install dependencies:

     ```bash
     npm i -g pnpm
     pnpm i
    ```

### Configuration

1. Obtain API keys from Last.fm by creating an account on [Last.fm](https://www.last.fm/api/account/create).
2. Copy `.env.example` in a new `.env` file:

    ```bash
    cp .env.example .env
    ```

3. Replace Last.fm keys with your API keys
4. Start the database:

    ```bash
    docker-compose up -d
    ```

### Usage

1. Start the application:

    ```bash
    pnpm start
    pnpm start:dev # for development
    ```

2. Open your web browser and go to [http://localhost:3000/api](http://localhost:3000/api) to see the API documentation (
   Swagger)
3. If you're visiting for the first time, then you'll need to create a user by sending a `POST` request
   to `/auth/register` with the following body:

    ```json
    {
      "email": "john.doe@gmail.com",
      "password": "password",
      "firstName": "John",
      "lastName": "Doe"
    }
    ```
   
4. After creating a user, you can log in by sending a `POST` request to `/auth/login` with the following body:

    ```json
    {
      "email": "john.doe@gmail.com",
      "password": "password"
    }
    ```
   
5. After logging in, you'll receive an `access_token` in the response body. Copy the token and click the `Authorize` button in
   the top right corner of the Swagger page. Paste the token in the `Value` field and click `Authorize`. You should now
   be able to access the API endpoints.

### Notes

> There is probably some bugs. I've encountered many, especially on the Last.fm API side (`/album/search` and `/album/info` endpoints).
> I've tried to handle them as good as I could, but I'm sure there are some that I've missed. If you encounter any, please let me know.

### Testing

1. Run the test suite:

    ```bash
    pnpm test
    ```

### Updates

1. To update this repository, run the following commands:
   
   ```bash
   # Make sure you are on the `main` branch
   git checkout main
   
   # Pull latest changes
   git pull
   ```

2. Now, you can restart your app:

   ```bash
   pnpm start
   ```