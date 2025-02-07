import type { APIMod } from "./Mod";
import type { APIUser } from "./User";

/** This type excludes unneeded properties, so it does not match the API response exactly. */
export type APIScore = StandardAPIScore | TaikoAPIScore | CatchAPIScore | ManiaAPIScore;

/** This type excludes unneeded properties, so it does not match the API response exactly. */
interface BaseAPIScore {
	id: number;
	room_id: number;
	user: APIUser;
	total_score: number;
	rank: "X" | "XH" | "S" | "SH" | "A" | "B" | "C" | "D";
	accuracy: number;
	max_combo: number;
	is_perfect_combo: boolean;
	pp: number;
	mods: APIMod[];
	ended_at: string;
}

export interface StandardAPIScore extends BaseAPIScore {
	maximum_statistics: {
		great: number;
		ignore_hit?: number;
		large_bonus?: number;
		small_bonus?: number;
		large_tick_hit?: number;
		slider_tail_hit?: number;
	};
	statistics: {
		great?: number;
		ok?: number;
		meh?: number;
		miss?: number;
		ignore_hit?: number;
		ignore_miss?: number;
		large_bonus?: number;
		small_bonus?: number;
		large_tick_hit?: number;
		large_tick_miss?: number;
		slider_tail_hit?: number;
	};
}
export interface TaikoAPIScore extends BaseAPIScore {
	maximum_statistics: {
		great: number;
		ignore_hit?: number;
		large_bonus?: number;
		small_bonus?: number;
	};
	statistics: {
		great?: number;
		ok?: number;
		miss?: number;
		ignore_hit?: number;
		ignore_miss?: number;
		large_bonus?: number;
		small_bonus?: number;
	};
}
export interface CatchAPIScore extends BaseAPIScore {
	maximum_statistics: {
		great: number;
		ignore_hit?: number;
		large_bonus?: number;
		large_tick_hit?: number;
		small_tick_hit?: number;
	};
	statistics: {
		great?: number;
		miss?: number;
		ignore_miss?: number;
		large_bonus?: number;
		large_tick_hit?: number;
		large_tick_miss?: number;
		small_tick_hit?: number;
		small_tick_miss?: number;
	};
}
export interface ManiaAPIScore extends BaseAPIScore {
	maximum_statistics: {
		perfect: number;
		ignore_hit?: number;
	};
	statistics: {
		perfect?: number;
		great?: number;
		good?: number;
		ok?: number;
		meh?: number;
		miss?: number;
		ignore_hit?: number;
		ignore_miss?: number;
		combo_break?: number;
	};
}
