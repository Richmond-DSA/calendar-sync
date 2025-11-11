import config, { validateConfig } from "./config";
import getUpcomingCalendarEvents from "./google/getUpcomingEvents";
import getDiscordEvents from "./discord/getDiscordEvents";
import { cleanup } from "./discord/getGuild";
import { syncEvents } from "./sync/syncEvents";
import type { FunctionParams } from "./models/interface";

export default async ({ log, error }: FunctionParams) => {
	// validate our config right away (throws if incorrect.)
	validateConfig(config);
	try {
		const calendarEvents = await getUpcomingCalendarEvents(log);
		const discordEvents = await getDiscordEvents();
		
		const results = await syncEvents(calendarEvents, discordEvents);

		log(`Sync results: \n${JSON.stringify(results, null, 2)}`);
		await cleanup()

		return results;
	} catch (err) {
		error(err);
		await cleanup();
		// throwing here so Appwrite captures the error.
		throw err;
	}
};
