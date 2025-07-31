import axios from "@/utils/axios";
import { ILogKy } from "./typing";
import { ipServiceKy } from "@/utils/ip";

export async function getLogKyApi(paging?: {page: number, page_size: number}) {
	return axios.get<ILogKy>(`${ipServiceKy}/sign-info`, {
        params: paging
    });
}