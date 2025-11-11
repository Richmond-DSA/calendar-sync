import { Collection, GuildScheduledEvent } from "discord.js";
import { CalendarEvent } from "../models/interface";
import createSyncPlan from "./createSyncPlan";
import createOrUpdateDiscordEvent from "../discord/createOrUpdateDiscordEvent";

const syncEvents = async (
	events: CalendarEvent[], 
	discordEventsCollection: Collection<string, GuildScheduledEvent>
) => {
	try {    
		// Convert to Map for easier lookup
		const discordEvents = new Map(discordEventsCollection.map(event => [event.id, event]));
				
		// Create sync plan
		const syncPlan = createSyncPlan(events, discordEvents);

		console.log({ create: syncPlan.toCreate.length, update: syncPlan.toUpdate.length, delete: syncPlan.toDelete.length })
		
		const results = {
			created: 0,
			updated: 0,
			deleted: 0,
			errors: [] as string[]
		};

		// Execute all operations concurrently using Promise.allSettled
		const [createResults, updateResults, deleteResults] = await Promise.all([
			// Create new events
			Promise.allSettled(
				syncPlan.toCreate.map(async (calendarEvent) => {
					await createOrUpdateDiscordEvent(calendarEvent);
					return calendarEvent.summary || 'Untitled Event';
				})
			),
			
			// Update existing events
			Promise.allSettled(
				syncPlan.toUpdate.map(async ({ calendarEvent, discordEvent }) => {
					await createOrUpdateDiscordEvent(calendarEvent, discordEvent);
					return calendarEvent.summary || 'Untitled Event';
				})
			),
			
			// Delete obsolete events
			Promise.allSettled(
				syncPlan.toDelete.map(async (discordEvent) => {
					await discordEvent.delete();
					return discordEvent.name;
				})
			)
		]);

		// Process create results
		createResults.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				results.created++;
			} else {
				const eventName = syncPlan.toCreate[index]?.summary || 'Unknown event';
				const errorMsg = `Failed to create event ${eventName}: ${result.reason}`;
				results.errors.push(errorMsg);
			}
		});

		// Process update results
		updateResults.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				results.updated++;
			} else {
				const eventName = syncPlan.toUpdate[index]?.calendarEvent.summary || 'Unknown event';
				const errorMsg = `Failed to update event ${eventName}: ${result.reason}`;
				results.errors.push(errorMsg);
			}
		});

		// Process delete results
		deleteResults.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				results.deleted++;
			} else {
				const eventName = syncPlan.toDelete[index]?.name || 'Unknown event';
				const errorMsg = `Failed to delete event ${eventName}: ${result.reason}`;
				results.errors.push(errorMsg);
			}
		});

		return results;
	} catch (error) {
		console.error(`Sync failed: ${error}`);
		throw error;
	}
};

export { syncEvents };