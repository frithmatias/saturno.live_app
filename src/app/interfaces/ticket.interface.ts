export interface TicketsResponse {
	ok: boolean;
	tickets: Ticket[];
}

export interface TicketResponse {
	ok: boolean;
	msg: string;
	ticket: Ticket | null;
}

export interface Ticket {
	id_ticket: number;
	id_socket: string;
	id_socket_desk: string | null;
	id_desk: number | null;
	id_company: string;
	id_type: string;
	tx_status: string;
	tm_start: number;
	tm_att: number | null;
	tm_end: number | null;
	_id: string;
}

// export class Ticket {
// 	constructor(
// 		public idTicket: number,
// 		public idSocket: string,
// 		public idDesk: number | null,
// 		public txStatus: string,
// 		public tmStart: number,
// 		public tmAtt: number | null,
// 		public tmEnd: number | null
// 	) {}
// }