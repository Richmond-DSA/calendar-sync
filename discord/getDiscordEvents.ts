import getGuild from "./getGuild";


const getDiscordEvents = async () => {
	try {
		const guild = await getGuild();
		const events = await guild.scheduledEvents.fetch();
		return events;
	} catch (error) {
		console.error(error);
		throw(error);
	}
};

export default getDiscordEvents;
