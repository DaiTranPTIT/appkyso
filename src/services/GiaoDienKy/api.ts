import axios from "axios";
import { IGetSign } from "./typing";
import { ipRoot } from "@/utils/ip";

export async function taoChuKy(formData: FormData) {
	return axios.post(`${ipRoot}/signature`, formData);
}

export async function suaChuKy(formData: FormData, id: string) {
	return axios.patch(`${ipRoot}/signature/${id}`, formData);
}

export async function apiKy(formData: FormData) {
	return axios.post(`${ipRoot}/sign/sign_hash`, formData);
}

export async function xoaChuKy(id: string) {
	return axios.delete(`${ipRoot}/signature/${id}`);
}

export async function getDsKyApi() {
	return axios.get<IGetSign>(`${ipRoot}/signature`);
}

export async function getListCredentialApi(req: {username: string, password: string}) {
	return axios.get<any>(`${ipRoot}/sign/credential/list`, {params: req});
}
