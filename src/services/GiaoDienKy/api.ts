import axios from "axios";
import { IGetSign } from "./typing";

export async function taoChuKy(formData: FormData) {
	return axios.post(`http://10.99.3.126:6700/api/v1/signature`, formData);
}

export async function suaChuKy(formData: FormData, id: string) {
	return axios.patch(`http://10.99.3.126:6700/api/v1/signature/${id}`, formData);
}

export async function apiKy(formData: FormData) {
	return axios.post(`http://10.99.3.126:6700/api/v1/signature/sign_hash`, formData);
}

export async function xoaChuKy(id: string) {
	return axios.delete(`http://10.99.3.126:6700/api/v1/signature/${id}`);
}

export async function getDsKyApi() {
	return axios.get<IGetSign>(`http://10.99.3.126:6700/api/v1/signature`);
}