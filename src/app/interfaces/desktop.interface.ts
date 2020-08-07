import { User } from 'src/app/interfaces/user.interface';

// ========================================================
// DESKTOPS
// ========================================================

export interface Desktop {
	id_company: string,
	cd_desktop: string,
	id_assistant: User | null,
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
