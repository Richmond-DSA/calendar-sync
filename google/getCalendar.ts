import { calendar } from '@googleapis/calendar';
import { GoogleAuth } from 'google-auth-library';

import config from '../config';

const { GOOGLE_CREDENTIALS_JSON } = config;

function getCalendar(log: (...args: any) => void) {
	try {
		const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON);
		const auth = new GoogleAuth({
				credentials: credentials,
				scopes: ['https://www.googleapis.com/auth/calendar']
		});

		const cal = calendar({ version: 'v3', auth });
		log('info', 'Google Calendar API initialized');
		return cal;
	} catch (error) {
		log('error', 'Failed to setup Google Auth', error);
		throw error;
	}
}

export default getCalendar;