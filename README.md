# Usage

To run the project, use the provided Docker Compose file:

```bash
docker compose up
```

# Variables

For the bot to function correctly, you'll need to set up the following variables:

## MongoDB database "test"

- `_id`: Discord server's ID
- `channelId`: Discord's channel ID
- `roleId`: Discord's role ID

## .env File

Create a `.env` file in the project root (next to `docker-compose.yml`) and add the following variables:

```dotenv
DISCORD_TOKEN=your_discord_token_here
MONGODB_URL=your_mongodb_connection_url_here
clientId=your_client_id_here
apikey=your_api_key_here
```

# Bot

## NPM Commands

Use these NPM commands for various functionalities:

- `npm run prod`: Run the bot in production mode with debugging logs.
- `npm run start`: Start the bot and display only standard error logs.
- `npm run testin`: Run test(s) for active-this system. / debug.

## Developing the Bot Requirements

Ensure the following dependencies are available:

- Node.js "v18.15.0"