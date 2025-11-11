import { Client, GatewayIntentBits, Guild } from "discord.js";
import config from "../config";

// Cache the client and guild
let cachedClient: Client | null = null;
let cachedGuild: Guild | null = null;

const getGuild = async (): Promise<Guild> => {
	try {
		// Return cached guild if available
		if (cachedGuild) {
				return cachedGuild;
		}

		// Create client if not cached
		if (!cachedClient) {
			cachedClient = new Client({
				intents: [
						GatewayIntentBits.Guilds,
						GatewayIntentBits.GuildScheduledEvents
				]
			});
			await cachedClient.login(config.DISCORD_TOKEN);
		}

		// Get and cache the guild
		cachedGuild = cachedClient.guilds.cache.get(config.GUILD_ID) || null;

		if (!cachedGuild) {
			throw new Error('Could not retrieve guild.');
		}

		return cachedGuild;
	} catch (error) {
		console.error(error);
		// Clear cache on error to force retry next time
		cachedClient = null;
		cachedGuild = null;
		throw error;
	}
};

export const cleanup = async () => {
	if (cachedClient) {
		await cachedClient.destroy();
		cachedClient = null;
		cachedGuild = null;
	}
};

export default getGuild;
