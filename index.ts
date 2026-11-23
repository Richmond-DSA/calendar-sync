import config, { validateConfig } from "./config";
import getUpcomingCalendarEvents from "./google/getUpcomingEvents";
import getDiscordEvents from "./discord/getDiscordEvents";
import { cleanup } from "./discord/getGuild";
import { syncEvents } from "./sync/syncEvents";

export default async () => {
	// validate our config right away (throws if incorrect.)
	validateConfig(config);
	try {
		const calendarEvents = await getUpcomingCalendarEvents(console.log);
		const discordEvents = await getDiscordEvents();

		const results = await syncEvents(calendarEvents, discordEvents);

		console.log(`Sync results: \n${JSON.stringify(results, null, 2)}`);

		return results;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await cleanup();
	}
};
