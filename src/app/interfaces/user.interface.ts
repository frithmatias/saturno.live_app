
export interface User {
    tx_name: string;
	tx_email: string;
    tx_password?: string;
	id_company?: string;
    bl_google?: boolean;
    tx_img?: string;
	id_role?: string;
	id_skills?: string[],
	fc_createdat?: Date;
	fc_lastlogin?: Date;
	__v?: number;
	_id?: string;
}

export interface UserResponse {
	ok: boolean;
	msg: string;
	user: User | null;
}

export interface UsersResponse {
	ok: boolean;
	msg: string;
	users: User[] | null;
}

