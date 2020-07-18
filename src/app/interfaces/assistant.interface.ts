// ========================================================
// ASSISTANT
// ========================================================

export interface Assistant {
	id_company: string;
	bl_google: boolean;
	tx_email: string;
	tx_nombre: string;
	tx_password: string;
	id_role: string;
	id_type: string,
	fc_createdat: Date;
	fc_lastlogin: Date;
	__v: number;
	_id: string;
}

export interface AssistantResponse {
	ok: boolean;
	msg: string;
	assistant: Assistant | null;
}

export interface AssistantsResponse {
	ok: boolean;
	msg: string;
	assistants: Assistant[] | null;
}