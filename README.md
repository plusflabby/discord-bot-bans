# Usage

To run the project, use the provided Docker Compose file:

```bash
docker compose up
```

# Developing the Bot

## Requirements

Ensure the following dependencies are available:

- Node.js v18.15.0
- Docker with Compose

## NPM Commands

Use these NPM commands for various functionalities:

1. `npm run prod`: Run the bot in production mode with debugging logs.
2. `npm run start`: Start the bot and display only standard error logs.

# Variables

For the bot to function correctly, you'll need to set up the following variables:

## MongoDB

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