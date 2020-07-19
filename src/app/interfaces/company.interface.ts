// ========================================================
// COMPANY
// ========================================================

export interface Company {
	tx_company_name: string;
    tx_address_street: string;
    tx_address_number: string;
    cd_city: string;
	__v?: number;
	_id?: string;
}

export interface CompanyResponse {
	ok: boolean;
	msg: string;
	company: Company | null;
}

export interface CompanysResponse {
	ok: boolean;
	msg: string;
	companies: Company[] | null;
}