import { GuildScheduledEvent } from "discord.js";
import { CalendarEvent } from "../models/interface";

// Helper function to extract Google Calendar ID from Discord event description
const extractGoogleCalendarId = (description: string | null): string | null => {
	if (!description) return null;
	const match = description.match(/Google Calendar Id: ([a-zA-Z0-9_-]+)/);
	return match ? match[1] : null;
};

// Helper function to compare if events need updating
const eventNeedsUpdate = (calendarEvent: CalendarEvent, discordEvent: GuildScheduledEvent): boolean => {
	const calendarStart = calendarEvent.start?.dateTime || calendarEvent.start?.date;
	const calendarEnd = calendarEvent.end?.dateTime || calendarEvent.end?.date;
	
	return (
		calendarEvent.summary !== discordEvent.name ||
		new Date(calendarStart!).getTime() !== discordEvent.scheduledStartTimestamp ||
		new Date(calendarEnd!).getTime() !== discordEvent.scheduledEndTimestamp ||
		calendarEvent.location !== discordEvent.entityMetadata?.location
	);
};

interface SyncPlan {
	toCreate: CalendarEvent[];
	toUpdate: { calendarEvent: CalendarEvent; discordEvent: GuildScheduledEvent }[];
	toDelete: GuildScheduledEvent[];
}

const createSyncPlan = (
	calendarEvents: CalendarEvent[], 
	discordEvents: Map<string, GuildScheduledEvent>
): SyncPlan => {
	const toCreate: CalendarEvent[] = [];
	const toUpdate: { calendarEvent: CalendarEvent; discordEvent: GuildScheduledEvent }[] = [];
	const toDelete: GuildScheduledEvent[] = [];
	
	// Track which Discord events have corresponding Calendar events
	const matchedDiscordEventIds = new Set<string>();

	// Process each calendar event
	for (const calendarEvent of calendarEvents) {
		if (!calendarEvent.id) continue;

		// Find corresponding Discord event
		let correspondingDiscordEvent: GuildScheduledEvent | null = null;
		
		for (const [discordId, discordEvent] of discordEvents) {
			const googleId = extractGoogleCalendarId(discordEvent.description);
			if (googleId === calendarEvent.id) {
				correspondingDiscordEvent = discordEvent;
				matchedDiscordEventIds.add(discordId);
				break;
			}
		}

		if (correspondingDiscordEvent) {
			// Event exists - check if it needs updating
			if (eventNeedsUpdate(calendarEvent, correspondingDiscordEvent)) {
				toUpdate.push({ calendarEvent, discordEvent: correspondingDiscordEvent });
			}
		} else {
			// Event doesn't exist - needs to be created
			toCreate.push(calendarEvent);
		}
	}

	// Find Discord events that should be deleted (no corresponding calendar event)
	for (const [discordId, discordEvent] of discordEvents) {
		const googleId = extractGoogleCalendarId(discordEvent.description);
		
		// Only delete events that were created by this sync (have Google Calendar ID)
		if (googleId && !matchedDiscordEventIds.has(discordId)) {
			toDelete.push(discordEvent);
		}
	}

	return { toCreate, toUpdate, toDelete };
};

export default createSyncPlan;