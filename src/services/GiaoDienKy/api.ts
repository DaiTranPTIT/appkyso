import axios from "axios";
import { IGetSign } from "./typing";
import { ipServiceKy } from "@/utils/ip";

export async function taoChuKy(formData: FormData) {
	return axios.post(`${ipServiceKy}/signature`, formData);
}

export async function suaChuKy(formData: FormData, id: string) {
	return axios.patch(`${ipServiceKy}/signature/${id}`, formData);
}

export async function apiKy(formData: FormData) {
	return axios.post(`${ipServiceKy}/sign/sign_hash`, formData);
}

export async function xoaChuKy(id: string) {
	return axios.delete(`${ipServiceKy}/signature/${id}`);
}

export async function getDsKyApi() {
	return axios.get<IGetSign>(`${ipServiceKy}/signature`);
}

export async function getListCredentialApi(req: {username: string, password: string}) {
	return axios.get<any>(`${ipServiceKy}/sign/credential/list`, {params: req});
}

export async function getSignInfoApi(id: string) {
	return axios.get(`${ipServiceKy}/sign-info/${id}`);
}