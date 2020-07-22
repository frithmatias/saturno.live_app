
// ========================================================
// SKILLS
// ========================================================

export interface Skill {
	id_company: string,
	id_skill: string,
	tx_skill: string,
	__v: number;
	_id: string;
}

export interface SkillResponse {
	ok: boolean;
	msg: string;
	skill: Skill | null;
}

export interface SkillsResponse {
	ok: boolean;
	msg: string;
	skills: Skill[] | null;
}
