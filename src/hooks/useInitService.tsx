import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useInitService = (url: string, ip?: string) => {
	const finalIp = ip ?? ip3;

	const getService = (
		payload: { page?: number; limit?: number; condition?: any },
		path?: string,
		isAbsolutePath?: boolean,
		headers?: any,
	) => {
		const finalPath = isAbsolutePath ? `${finalIp}/${path}` : `${finalIp}/${url}/${path ?? ''}`;
		return axios.get(finalPath, { params: payload, headers });
	};

	const postService = (payload: any, headers?: any) => {
		return axios.post(`${finalIp}/${url}`, payload, { headers });
	};

	const putService = (id: string | number, payload: any, headers?: any) => {
		return axios.put(`${finalIp}/${url}/${id}`, payload, { headers });
	};

	const putManyService = (ids: (string | number)[], update: any, headers?: any) => {
		return axios.put(`${finalIp}/${url}/many/ids`, { ids, update }, { headers });
	};

	const deleteService = (id: string | number, silent?: boolean, headers?: any) => {
		return axios.delete(`${finalIp}/${url}/${id}`, { data: { silent }, headers });
	};

	const deleteManyService = (ids: (string | number)[], silent?: boolean, headers?: any) => {
		return axios.delete(`${finalIp}/${url}/many/ids`, { data: { silent, ids }, headers });
	};

	const getAllService = (payload?: { condition?: any; sort?: any }, path?: string, headers?: any) => {
		return axios.get(`${finalIp}/${url}/${path || 'many'}`, { params: payload, headers });
	};

	const getByIdService = (id: string | number, headers?: any) => {
		return axios.get(`${finalIp}/${url}/${id}`, { headers });
	};

	const getImportHeaders = () => {
		return axios.get(`${finalIp}/${url}/import/definition`, { data: { silent: true } });
	};

	const getImportTemplate = (headers?: any) => {
		return axios.get(`${finalIp}/${url}/import/template/xlsx`, {
			responseType: 'arraybuffer',
			headers,
		});
	};

	const postValidateImport = (payload: any, headers?: any) => {
		return axios.post(`${finalIp}/${url}/import/validate`, payload, { headers });
	};

	const postExecuteImport = (payload: any, headers?: any) => {
		return axios.post(`${finalIp}/${url}/import/insert`, payload, { headers });
	};

	const getExportFields = () => {
		return axios.get(`${finalIp}/${url}/export/definition`, { data: { silent: true } });
	};

	const postExport = (
		payload: { ids?: string[]; definitions: any[] },
		params?: { condition?: any; filters?: any },
		headers?: any,
	) => {
		return axios.post(`${finalIp}/${url}/export/xlsx`, payload, {
			params,
			responseType: 'arraybuffer',
			headers,
		});
	};

	return {
		getService,
		getByIdService,
		postService,
		putService,
		putManyService,
		deleteService,
		deleteManyService,
		getAllService,
		getImportHeaders,
		getImportTemplate,
		postValidateImport,
		postExecuteImport,
		getExportFields,
		postExport,
	};
};

export default useInitService;
