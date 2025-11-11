# Calendar Sync

An Appwrite Function that automatically synchronizes Google Calendar events with Discord scheduled events. This runs as a scheduled cron job to keep your Discord server events in sync with your organization's calendar. It only does a one-way sync, Discord events will not be published on our Public Events Calendar.

## Overview

This project:
- Fetches upcoming events from a Google Calendar
- Creates, updates, or deletes corresponding Discord scheduled events (only deletes Discord events that were created by this bot)
- Maintains synchronization by tracking Google Calendar IDs in Discord event descriptions
- Runs as an Appwrite Function on a scheduled trigger

## Prerequisites

- Node.js 20+ 
- Access to VaultWarden for environment variables
- Google Cloud Console access for Calendar API credentials
- Discord bot with appropriate permissions
- Appwrite project setup

## Environment Variables

The following environment variables are required and should be stored in RDSA's VaultWarden:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
GUILD_ID=your_discord_server_id

# Google Calendar Configuration  
GOOGLE_CALENDAR_ID=your_google_calendar_id
GOOGLE_CREDENTIALS_JSON=your_service_account_json_string

# Sync Configuration
DAYS_TO_SYNC=14  # Number of days ahead to sync (optional, defaults to 14)
```

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/Richmond-DSA/calendar-sync.git
cd calendar-sync
npm install
```

### 2. Get Environment Variables from VaultWarden

1. Log in to RDSA's VaultWarden
2. Look for 'calendar-sync env vars' under Tech Committee
3. Copy the environment variables for this project
4. Create a `.env` file in the project root with these variables

### 3. Google Calendar API Setup

RDSA already has a Google Cloud project called `calendar-sync` with the Calendar API enabled. You'll need:

1. Access to the existing service account credentials (stored in VaultWarden as `GOOGLE_CREDENTIALS_JSON`)
2. The specific Google Calendar ID you want to sync (stored in VaultWarden as `GOOGLE_CALENDAR_ID`)
3. Ensure the service account has access to read the target calendar

### 4. Set up Discord Bot

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and copy the token
3. Invite the bot to your server with permissions to manage events
4. Copy your Discord server (guild) ID

### 5. Local Testing

Since this is designed as an Appwrite Function, you can test locally without Docker:

```bash
# Build and run local test
yarn test:local

# Development mode with auto-reload
yarn dev

# Just build
yarn build
```

The local test runner simulates the Appwrite environment and allows you to test the sync logic with your real Google Calendar and Discord server.

## Project Structure

```
calendar-sync/
├── index.ts                 # Main Appwrite Function entry point
├── config.ts               # Configuration and validation
├── models/
│   └── interface.ts        # TypeScript interfaces
├── google/
│   └── getUpcomingEvents.ts # Google Calendar integration
├── discord/
│   ├── getGuild.ts         # Discord client and guild management
│   └── getDiscordEvents.ts # Discord events fetching
├── sync/
│   └── syncEvents.ts       # Main sync logic
├── test/
│   └── local-runner.ts     # Local testing utilities
└── functions/
    └── calendar-sync/      # Appwrite Function deployment files
```

## How It Works

1. **Fetch Events**: Retrieves upcoming events from the configured Google Calendar
2. **Compare State**: Compares Google Calendar events with existing Discord events
3. **Create Sync Plan**: Determines which Discord events need to be created, updated, or deleted
4. **Execute Changes**: Performs all operations concurrently using `Promise.allSettled`
5. **Track Association**: Links events by storing Google Calendar IDs in Discord event descriptions

## Deployment to Appwrite

The function is configured to deploy to Appwrite with the following specifications:

- **Project ID**: `690eb2e10033c6d34d5e`
- **Endpoint**: `https://nyc.cloud.appwrite.io/v1`
- **Runtime**: Node.js 22
- **Specification**: 0.5 vCPU, 512MB RAM
- **Timeout**: 15 seconds
- **Entry Point**: `dist/index.js`

### 1. Build and Deploy

```bash
# Install dependencies and build
yarn && yarn build

# Deploy using Appwrite CLI
appwrite functions createDeployment --functionId=691398db00066f8984cb
```

### 2. Configure Schedule

Set up the cron trigger in Appwrite:
- **Frequency**: Once per hour (recommended: `0 */1 * * *`)
- **Timezone**: Set according to your calendar's timezone

The hourly frequency ensures events stay synchronized without overwhelming the APIs with unnecessary requests.

## Monitoring

The function provides detailed logging for:
- Number of calendar events retrieved
- Sync plan summary (create/update/delete counts)
- Individual operation results and errors
- Overall sync statistics

Check Appwrite Function logs for monitoring and troubleshooting.

## Error Handling

- **Graceful degradation**: Failed individual operations don't stop the entire sync
- **Connection cleanup**: Discord client connections are properly cleaned up
- **Detailed error reporting**: Each failed operation is logged with specific error details
- **Configuration validation**: Environment variables are validated on startup

## Contributing

1. Follow the local development setup
2. Make changes and test locally using `yarn dev`
3. Ensure TypeScript compilation passes: `yarn build`
4. Submit pull requests with clear descriptions

## License
MIT
