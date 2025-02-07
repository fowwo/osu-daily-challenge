import type { Mod } from "./Mod";
import type { Score } from "./Score";

export interface Room {
	date: string;
	mode: "osu" | "taiko" | "fruits" | "mania";
	mods: Mod[];
	scores: Score[];
	participant_count: number;
	beatmap: {
		id: number;
		set_id: number;
		artist: string;
		artist_unicode: string;
		title: string;
		title_unicode: string;
		source: string;
		track_id: number | null;
		cover_version: string;
		creator: string;
		creator_id: number;
		version: string;
		star_rating: number;
		length: number;
	};
}
