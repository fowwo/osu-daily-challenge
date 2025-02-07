import type { APIMod } from "./Mod";

/** This type excludes unneeded properties, so it does not match the API response exactly. */
export interface APIRoom {
	id: number;
	starts_at: string;
	participant_count: number;
	current_playlist_item: {
		id: number;
		required_mods: APIMod[];
		beatmap: {
			id: number;
			user_id: number;
			mode: "osu" | "taiko" | "fruits" | "mania";
			version: string;
			difficulty_rating: number;
			total_length: number;
			status: "ranked" | "approved" | "loved";
			beatmapset: {
				id: number;
				creator: string;
				artist: string;
				artist_unicode: string;
				title: string;
				title_unicode: string;
				source: string;
				track_id: number | null;
				covers: { cover: string; };
			};
		};
	};
}
