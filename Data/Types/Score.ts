import type { APIScore, StandardAPIScore, TaikoAPIScore, CatchAPIScore, ManiaAPIScore } from "./API/Score";
import type { Mod } from "./Mod";

export type Score = StandardScore | TaikoScore | CatchScore | ManiaScore;

interface BaseScore {
	id: number;
	user_id: number;
	score: number;
	accuracy: number;
	max_combo: number;
	is_perfect_combo: boolean;
	grade: APIScore["rank"];
	mods: Mod[];
	pp: number;
	timestamp: string;
}

export interface StandardScore extends BaseScore {
	maximum_statistics: StandardAPIScore["maximum_statistics"];
	statistics: StandardAPIScore["statistics"];
}
export interface TaikoScore extends BaseScore {
	maximum_statistics: TaikoAPIScore["maximum_statistics"];
	statistics: TaikoAPIScore["statistics"];
}
export interface CatchScore extends BaseScore {
	maximum_statistics: CatchAPIScore["maximum_statistics"];
	statistics: CatchAPIScore["statistics"];
}
export interface ManiaScore extends BaseScore {
	maximum_statistics: ManiaAPIScore["maximum_statistics"];
	statistics: ManiaAPIScore["statistics"];
}
