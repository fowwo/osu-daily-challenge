import type { APIRoom } from "./Types/API/Room";
import type { APIScore } from "./Types/API/Score";

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
	return await fetchAPI("rooms?category=daily_challenge&mode=all" + (limit ? `&limit=${limit}` : ""), token, {
		headers: { "x-api-version": "20240529" }
	}) as APIRoom[];
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
