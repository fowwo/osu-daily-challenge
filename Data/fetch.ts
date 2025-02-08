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
