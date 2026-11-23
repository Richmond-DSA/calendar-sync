import sync from "../../index";

export default async () => {
	await sync();
};

// UTC cron
export const config = {
	schedule: "0 */3 * * *",
};
