import { Skill } from 'src/app/interfaces/skill.interface';
import { Desktop } from 'src/app/interfaces/desktop.interface';
// ========================================================
// TICKET
// ========================================================

export interface Ticket {
	id_root: string | null;
	id_child: string | null;
	cd_number: number;
	id_socket: string;
	id_socket_desk: string | null;
	id_desk: Desktop | null;
	id_assistant: string | null;
	id_company: string;
	id_skill: Skill;
	tm_start: number;
	tm_att: number | null;
	tm_end: number | null;
	_id: string;
}

export interface TicketResponse {
	ok: boolean;
	msg: string;
	ticket: Ticket | null;
}

export interface TicketsResponse {
	ok: boolean;
	tickets: Ticket[];
}



