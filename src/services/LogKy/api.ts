import axios from "@/utils/axios";
import { apiGateway } from "@/utils/ip";
import { ILogKy } from "./typing";

export async function getLogKyApi(paging?: {page: number, page_size: number}) {
	return axios.get<ILogKy>(`${apiGateway}/api/v1/sign-info`, {
        params: paging
    });
}