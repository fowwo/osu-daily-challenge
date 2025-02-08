import type { APIRoom } from "./Types/API/Room";

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
