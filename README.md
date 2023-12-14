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

### 7. Playlists

Users can create playlists of their favorite albums. Playlists can be shared with other users, and users can add albums
to their own playlists. Also, our admins can create global playlists that are visible to all users.

### 8. Spotify Integration

Users can connect their Spotify account to the application. This allows users to add albums to their Spotify library
directly from the application.

## API Reference

### Authentication

| Method | Endpoint          | Description              | Body                                                                                                | Auth   | Important notes                                                         |
|--------|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------|--------|-------------------------------------------------------------------------|
| POST   | `/auth/register`  | Register a new user      | `{ "email": "john.doe@gmail.com", "password": "password", "firstName": "John", "lastName": "Doe" }` |        | If duplicate email, it throws `duplicate key` error                     |
| POST   | `/auth/login`     | Log in an existing user  | `{ "email": "john.doe@gmail.com", "password": "password" }`                                         |        | If wrong email, throws `User not found` error, else `Unauthorized`error |

### Users

| Method | Endpoint        | Description        | Body                                            | Auth         | Important notes                                           |
|--------|-----------------|--------------------|-------------------------------------------------|--------------|-----------------------------------------------------------|
| GET    | `/user/profile` | Get user profile   |                                                 | Bearer token | If no token or invalid token, throws `Unauthorized` error |
| GET    | `/user`         | Get all users      |                                                 | Bearer token | ADMIN                                                     |
| PATCH  | `/user/:id`     | Updates user by ID | `{ "firstName": "Johny", "lastName": "Smith" }` | Bearer token | ADMIN                                                     |
| DELETE | `/user/:id`     | Delete user by ID  |                                                 | Bearer token | ADMIN                                                     |

### Albums

| Method | Endpoint                                                        | Description        | Body | Auth         | Important notes             | 
|--------|-----------------------------------------------------------------|--------------------|------|--------------|-----------------------------|
| GET    | `/album`                                                        | Get all albums     |      |              | Authentication not required |
| GET    | `/album/:id`                                                    | Get album by ID    |      |              | Authentication not required |
| GET    | `/album/last-fm/search?query=<query>`                           | Search for albums  |      | Bearer token |                             |
| GET    | `/album/last-fm/info?artist=<artist>&album=<album>`             | Get album info     |      | Bearer token |                             |
| GET    | `/album/last-fm/similar?artist=<artist>`                        | Get similar albums |      | Bearer token |                             |
| GET    | `/album/spotify/new-releases?country=<ISO 3166-2 country code>` | Get new releases   |      | Bearer token |                             |

### Artists

| Method | Endpoint                               | Description                    | Body | Auth         | Important notes |
|--------|----------------------------------------|--------------------------------|------|--------------|-----------------|
| GET    | `/artist/last-fm/search?query=<query>` | Search for artists             |      | Bearer token |                 |
| GET    | `/artist/last-fm/info?artist=<artist>` | Get artist info and top albums |      | Bearer token |                 |

### Playlists (of albums)

| Method | Endpoint                  | Description                  | Body                                        | Auth         | Important notes                            |
|--------|---------------------------|------------------------------|---------------------------------------------|--------------|--------------------------------------------|
| GET    | `/playlist/:id`           | Get playlist by ID           |                                             | Bearer token | Returns playlist with all albums           |
| GET    | `/playlist`               | Get all playlists pagination |                                             | Bearer token |                                            |
| GET    | `/playlist/me/all`        | Get all playlists from user  |                                             | Bearer token |                                            |
| POST   | `/playlist`               | Creates playlist             | `{ "name": "Test", "description": "test" }` | Bearer token | Creates a playlist with empty albums array |
| PUT    | `/playlist/:id`           | Updates playlist by ID       | `{ "name": "Test" }`                        | Bearer token | Can update only name and description       |
| POST   | `/playlist/:id/albums`    | Adds albums to playlist      | `{ "albumIds": [] }`                        | Bearer token |                                            |
| DELETE | `/playlist/:id/albums`    | Removes albums from playlist | `{ "albumIds": [] }`                        | Bearer token |                                            |
| DELETE | `/playlist/:id`           | Delete playlist              |                                             | Bearer token |                                            |
| GET    | `/playlist/global`        | Returns global playlists     |                                             |              |                                            |

## Getting Started

Follow these steps to get the Album Tracker up and running on your local machine:

### Prerequisites

- [Node JS v20.9.0](https://nodejs.org/en/download/).
- [Docker](https://www.docker.com/get-started).

### Development

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

1. Copy `.env.example` in a new `.env` file:

    ```bash
    cp .env.example .env
    ```
2. Obtain API keys from Last.fm by creating an account on [Last.fm](https://www.last.fm/api/account/create) and replace the
   `LAST_FM_API_KEY` and `LAST_FM_SEARCH_LIMIT` in the `.env` file.
3. Obtain API keys from [Spotify](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) and replace the
   `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the `.env` file.

### Usage

1. Start the application:

    ```bash
    docker-compose up -d
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
   
   or define admin user by updating your `.env` file with the following:

    ```bash
   CREATE_ADMIN=1 # will create an admin user on app start
   ADMIN_EMAIL=admin@album-tracker.com # or whatever email you want
   ADMIN_PASSWORD=admin # or whatever password you want
   ```
   
4. After creating a user, you can log in by sending a `POST` request to `/auth/login` with the following body:

    ```json
    {
      "email": "john.doe@gmail.com",
      "password": "password"
    }
    ```
   
   or 

    ```json
    {
      "email": "admin@album-tracker.com",
      "password": "admin"
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