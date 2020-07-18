
// ========================================================
// DESKTOPS
// ========================================================

export interface Desktop {
	id_company: string,
	id_desktop: string,
	fc_from: Date;
	fc_to: Date;
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
