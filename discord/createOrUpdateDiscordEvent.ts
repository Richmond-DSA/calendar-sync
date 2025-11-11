import { GuildScheduledEvent } from "discord.js";

import { CalendarEvent } from "../models/interface";
import getGuild from "./getGuild";

const createOrUpdateDiscordEvent = async (event: CalendarEvent, discordEvent?: GuildScheduledEvent) => {
	try {
		const startTime = event.start?.dateTime || event.start?.date;
		const endTime = event.end?.dateTime || event.end?.date;

		if (!startTime || !endTime) {
			throw new Error(`Cannot determine start and end times for event ${discordEvent ? 'update' : 'creation'}.`)
		}

		let description = event.description || '';
		// attach the google calendar id in the description (unfortunately this is the only place we can associate the two)
		description += `\n\nGoogle Calendar Id: ${event.id}` 

		const params = {
			description,
			entityType: 3, // external
			name: event.summary || 'Untitled Event',
			scheduledStartTime: startTime,
			scheduledEndTime: endTime,
			privacyLevel: 2, // GUILD_ONLY
			entityMetadata: {
				location: event.location || 'See calendar for details',
			}
		};

		let res: GuildScheduledEvent;

		if (discordEvent) {
			res = await discordEvent.edit(params);
			console.log(`update event with name ${params.name}`)
		} else {
			const guild = await getGuild();
			res = await guild.scheduledEvents.create(params);
			console.log(`Created event with name: ${params.name}`)
		}
		return res;
	} catch (error) {
		console.error(error);
		throw(error);
	}
};

export default createOrUpdateDiscordEvent;
