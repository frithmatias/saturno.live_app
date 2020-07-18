export interface User {
    tx_name: string;
	tx_email: string;
    tx_password: string;
	id_company: string;
    bl_google?: boolean;
    id_transaction?: string;
    tx_img?: string;
	id_role?: string;
	id_type?: string,
	fc_createdat?: Date;
	fc_lastlogin?: Date;
	__v?: number;
	_id?: string;
}

