import axios from "@/utils/axios";
import { ILogKy } from "./typing";
import { ipRoot } from "@/utils/ip";

export async function getLogKyApi(paging?: {page: number, page_size: number}) {
	return axios.get<ILogKy>(`${ipRoot}/sign-info`, {
        params: paging
    });
}