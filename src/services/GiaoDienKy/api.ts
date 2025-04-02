import axios from "axios";
import { IGetSign } from "./typing";

export async function taoChuKy(formData: FormData) {
	return axios.post(`https://digital-signature.ript.vn/api/api/v1/signature`, formData);
}

export async function suaChuKy(formData: FormData, id: string) {
	return axios.patch(`https://digital-signature.ript.vn/api/api/v1/signature/${id}`, formData);
}

export async function apiKy(formData: FormData) {
	return axios.post(`https://digital-signature.ript.vn/api/api/v1/signature/sign_hash`, formData);
}

export async function xoaChuKy(id: string) {
	return axios.delete(`https://digital-signature.ript.vn/api/api/v1/signature/${id}`);
}

export async function getDsKyApi() {
	return axios.get<IGetSign>(`https://digital-signature.ript.vn/api/api/v1/signature`);
}

export async function getListCredentialApi(req: {username: string, password: string}) {
	return axios.get<any>(`https://digital-signature.ript.vn/api/api/v1/signature/credential/list`, {params: req});
}
