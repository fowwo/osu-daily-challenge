import { readFileSync, writeFileSync } from "fs";
import { fetchMissingRooms, yieldScores } from "./fetch";
import { Room } from "./Types/Room";
import { User } from "./Types/User";

const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = process.env;

// Check for necessary environment variables.
if (!CLIENT_ID || !CLIENT_SECRET || !ACCESS_TOKEN) {
	console.error("Missing necessary environment variables:",
		[ "CLIENT_ID", "CLIENT_SECRET", "ACCESS_TOKEN" ].filter(x => !process.env[x]).join(", ")
	);
	process.exit(1);
}

// Load data from file.
const data: { rooms: { [room_id: number]: Room }; users: { [user_id: number]: User } } = JSON.parse(readFileSync("./data.json", "utf8"));
data.rooms ??= {};
data.users ??= {};

// Check for missing daily challenges.
log("Checking for missing daily challenges...");
const missingRooms = await fetchMissingRooms(ACCESS_TOKEN, Object.values(data.rooms));
log(missingRooms.length, `missing daily challenge${missingRooms.length === 1 ? "" : "s"} found.`);
if (missingRooms.length === 0) process.exit(0);

// Save new rooms (with initially empty scores list).
for (const { room_id, room } of missingRooms) data.rooms[room_id] = room;

// Fetch scores while respecting rate limit.
log("Fetching scores...");
const rateLimit = 1200, rateCooldown = 60000; // 1200 calls per minute
let generators = missingRooms.map(({ room_id, playlist_item_id }) => ({ room_id, generator: yieldScores(ACCESS_TOKEN, room_id, playlist_item_id) }));
while (true) {
	let remainingCalls = rateLimit, timeout;
	const cooldown = new Promise((resolve) => timeout = setTimeout(resolve, rateCooldown));

	// Fetch scores until all generators are consumed or rate limit is reached.
	const remainingGenerators: typeof generators = [];
	await Promise.all(generators.map(({ room_id, generator }) => new Promise<void>(async resolve => {
		let done = false;
		while (remainingCalls) {
			remainingCalls--;
			const result = await generator.next();
			if (done = result.done!) {
				remainingCalls++; // No API call was made.
				log(data.rooms[room_id].date, "->", data.rooms[room_id].scores.length, `score${data.rooms[room_id].scores.length === 1 ? "": "s"} fetched.`);
				break;
			}

			// Store score and user data for each score.
			for (const { room_id, user_id, score, user } of result.value) {
				data.rooms[room_id].scores.push(score);
				data.users[user_id] = user;
			}
		}

		// If the rate limit is reached, maintain the generator for when the cooldown is over.
		if (!done) remainingGenerators.push({ room_id, generator });

		resolve();
	})));

	// No need to wait for cooldown if all generators are consumed.
	if (remainingGenerators.length === 0) {
		clearTimeout(timeout);
		break;
	}

	// Wait for cooldown.
	log("Rate limit reached. Waiting for 1 minute...");
	await cooldown;

	log("Fetching more scores...");
	generators = remainingGenerators;
}

// Save data to file.
log("Saving data...");
writeFileSync("data.json", JSON.stringify(data), "utf8");

const scoreCount = missingRooms.reduce((sum, { room }) => sum + room.scores.length, 0);
log("Done.", `(${missingRooms.length} daily challenge${missingRooms.length === 1 ? "" : "s"}, ${scoreCount} score${scoreCount === 1 ? "" : "s"})`);

/** Appends the current time in HH:MM:SS format to the beginning of the message and prints it. */
function log(...messages: any[]) { console.log(`[${new Date().toISOString().substring(11, 19)}]`, ...messages); }
