/** This type excludes unneeded properties, so it does not match the API response exactly. */
export interface APIUser {
	id: number;
	username: string;
	country: { code: string; name: string; };
	avatar_url: string;
	cover: { url: string; };
}
