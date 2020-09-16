// ========================================================
// SUPERUSER
// ========================================================

export interface MenusResponse {
	ok: boolean;
	msg: string;
	menu: Menu[] | null;
}

export interface MenuResponse {
	ok: boolean;
	msg: string;
	menu: Menu | null;
}

export interface Menu {
    cd_role: number;
	tx_titulo: string,
	tx_icon?: string,
	ar_submenu?: Submenu[],
	_id: string;
}

export interface Submenu {
    cd_pricing: number;
    tx_titulo: string;
    tx_icon: string;
    tx_url: string;
}



