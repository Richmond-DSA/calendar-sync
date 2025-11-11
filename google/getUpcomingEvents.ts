import getCalendar from "./getCalendar";
import config from '../config';
import type { Log } from "../models/interface";

const { GOOGLE_CALENDAR_ID, DAYS_TO_SYNC = 14 } = config;

async function getUpcomingCalendarEvents(log: Log) {
	const now = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + DAYS_TO_SYNC);

	try {
		const calendar = getCalendar(log);
		const res = await calendar.events.list({
				calendarId: GOOGLE_CALENDAR_ID,
				timeMin: now.toISOString(),
				timeMax: endDate.toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
		});
		return res.data.items || [];
	} catch (error) {
		log(error);
		throw error;
	}
}

export default getUpcomingCalendarEvents;
