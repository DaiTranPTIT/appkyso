import type { ELogAction } from './constant';

declare module AuditLog {
	export interface IRecord {
		_id: string;
		uId: string;
		uCode: string;
		uEmail: string;
		uName: string;

		action: ELogAction;
		description?: string;
		sourceId?: string;
		logResponse?: boolean;

		data: any;
		query: any;
		param: any;
		response: any;
		error: any;

		requestType: string;
		ip: string;
		ua: any;
		userAgent: string;

		createdAt: string;
	}
}
