import type { APIRoom } from "./Types/API/Room";
import type { APIScore } from "./Types/API/Score";
import type { Room } from "./Types/Room";
import type { Score } from "./Types/Score";
import type { User } from "./Types/User";

/** Retrieves only the desired information from a room.  */
export function reformatRoom(room: APIRoom): { room_id: number; playlist_item_id: number; room: Room; } {
	const {
		id, starts_at, participant_count, current_playlist_item: {
			required_mods, id: playlist_item_id, beatmap: {
				id: beatmap_id, difficulty_rating, mode,
				total_length, user_id, version, beatmapset: {
					id: set_id, artist, artist_unicode, covers: { cover },
					creator, source, title, title_unicode, track_id
				}
			}
		}
	} = room;
	return {
		room_id: id,
		playlist_item_id,
		room: {
			date: new Date(starts_at).toISOString().substring(0, 10), // YYYY-MM-DD
			mode,
			mods: required_mods,
			scores: [],
			participant_count,
			beatmap: {
				id: beatmap_id,
				set_id,
				artist,
				artist_unicode,
				title,
				title_unicode,
				source,
				track_id,
				cover_version: cover.split("?")[1],
				creator,
				creator_id: user_id,
				version,
				star_rating: difficulty_rating,
				length: total_length,
			}
		}
	};
}

/** Retrieves only the desired information from a score.  */
export function reformatScore(score: APIScore): { room_id: number; user_id: number; score: Score; user: User; } {
	const {
		id, room_id, user: {
			id: user_id, username, country, avatar_url,
			cover: { url }
		}, total_score, rank, accuracy, max_combo, is_perfect_combo,
		pp, mods, ended_at, maximum_statistics, statistics
	} = score;
	return {
		room_id,
		user_id,
		score: {
			id,
			user_id,
			score: total_score,
			accuracy,
			max_combo,
			is_perfect_combo,
			grade: rank,
			mods,
			pp,
			timestamp: ended_at,
			statistics,
			maximum_statistics
		} as Score,
		user: {
			username,
			country,
			avatar: avatar_url,
			cover: url
		}
	};
}
