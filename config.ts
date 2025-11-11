import dotenv from 'dotenv';

dotenv.config();

interface Config {
  DAYS_TO_SYNC: number,
  DISCORD_TOKEN: string,
  GUILD_ID: string,
  GOOGLE_CALENDAR_ID: string,
  GOOGLE_CREDENTIALS_JSON: string, 
}

const {
  DAYS_TO_SYNC = '14',
  DISCORD_TOKEN,
  GUILD_ID,
  GOOGLE_CALENDAR_ID,
  GOOGLE_CREDENTIALS_JSON,
} = process.env;

const parsedDaysToSync = parseInt(DAYS_TO_SYNC, 10);

const config = {
  DAYS_TO_SYNC: Number.isNaN(parsedDaysToSync) ? parsedDaysToSync : 14,
  DISCORD_TOKEN,
  GUILD_ID,
  GOOGLE_CALENDAR_ID,
  GOOGLE_CREDENTIALS_JSON, 
};

export function validateConfig(config: Config) {
    const missing = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return true;
  }

export default config as Config;