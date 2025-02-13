import { reformatRoom, reformatScore } from "./reformat";
import type { APIRoom } from "./Types/API/Room";
import type { APIScore } from "./Types/API/Score";
import type { Room } from "./Types/Room";

/** Fetches from the API with default headers and error handling. */
export async function fetchAPI(endpoint: string, token: string, init?: RequestInit) {
	const res = await fetch("https://osu.ppy.sh/api/v2/" + endpoint, {
		...init,
		headers: {
			"Accept": "application/json",
			"Authorization": `Bearer ${token}`,
			...init?.headers
		}
	});

	if (!res.ok) throw new Error(`Failed to fetch API: ${res.status} - ${res.statusText}. ${JSON.stringify(await res.json())}`);
	return await res.json();
}

/** Fetches the daily challenge rooms and returns the result as provided by the API. */
export async function fetchAPIRooms(token: string, limit?: number) {
	return await fetchAPI("rooms?category=daily_challenge&mode=ended" + (limit ? `&limit=${limit}` : ""), token, {
		headers: { "x-api-version": "20240529" }
	}) as APIRoom[];
}

/** Fetches the daily challenge rooms and returns only the desired information. */
export async function fetchRooms(token: string, limit?: number) {
	return (await fetchAPIRooms(token, limit)).map(room => reformatRoom(room));
}

/** Fetches the missing daily challenge rooms and returns only the desired information. */
export async function fetchMissingRooms(token: string, existingRooms: Room[]) {
	const dates = new Set(existingRooms.map(room => room.date));
	const limit = getFetchRoomLimit(dates);
	if (limit === 0) return [];

	const rooms = await fetchRooms(token, limit);
	return rooms.filter(({ room }) => !dates.has(room.date));
}

/** Fetches the scores from a daily challenge in batches of 50 and returns the scores and cursor string as provided by the API. */
export async function fetchAPIScores(token: string, room: number, playlist: number, cursor_string?: string) {
	return await fetchAPI(`rooms/${room}/playlist/${playlist}/scores` + (cursor_string ? `?cursor_string=${cursor_string}` : ""), token) as { scores: APIScore[], cursor_string: string | null };
}

/** Fetches and yields the scores from a daily challenge in batches of 50 and returns the scores as provided by the API. */
export async function* yieldAPIScores(token: string, room: number, playlist: number, cursor_string?: string | null) {
	while (cursor_string !== null) {
		const res = await fetchAPIScores(token, room, playlist, cursor_string);
		yield res.scores;
		cursor_string = res.cursor_string;
	}
}

/** Fetches and yields the scores from a daily challenge in batches of 50 and returns only the desired information. */
export async function* yieldScores(token: string, room: number, playlist: number, cursor_string?: string | null) {
	for await (const scores of yieldAPIScores(token, room, playlist, cursor_string)) {
		yield scores.map(score => reformatScore(score));
	}
}

/** Gets the minimum number of rooms to fetch all missing rooms. */
function getFetchRoomLimit(dates: Set<string>) {
	const date = new Date("2024-07-25");
	const today = new Date(new Date().toISOString().substring(0, 10));

	while (date <= today) {
		const isoString = date.toISOString().substring(0, 10);
		if (!dates.has(isoString)) return (today.valueOf() - date.valueOf()) / 86400000;
		date.setUTCDate(date.getUTCDate() + 1);
	}
	return 0;
}
