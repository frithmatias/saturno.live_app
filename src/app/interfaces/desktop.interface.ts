
// ========================================================
// DESKTOPS
// ========================================================

export interface Desktop {
	id_company: string,
	id_desktop: string,
	id_assistant: string,
	__v: number;
	_id: string;
}

export interface DesktopResponse {
	ok: boolean;
	msg: string;
	desktop: Desktop | null;
}

export interface DesktopsResponse {
	ok: boolean;
	msg: string;
	desktops: Desktop[] | null;
}
