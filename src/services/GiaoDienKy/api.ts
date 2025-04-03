import axios from "axios";
import { IGetSign } from "./typing";
import { apiGateway } from "@/utils/ip";

export async function taoChuKy(formData: FormData) {
	return axios.post(`${apiGateway}/api/v1/signature`, formData);
}

export async function suaChuKy(formData: FormData, id: string) {
	return axios.patch(`${apiGateway}/api/v1/signature/${id}`, formData);
}

export async function apiKy(formData: FormData) {
	return axios.post(`${apiGateway}/api/v1/signature/sign_hash`, formData);
}

export async function xoaChuKy(id: string) {
	return axios.delete(`${apiGateway}/api/v1/signature/${id}`);
}

export async function getDsKyApi() {
	return axios.get<IGetSign>(`${apiGateway}/api/v1/signature`);
}

export async function getListCredentialApi(req: {username: string, password: string}) {
	return axios.get<any>(`${apiGateway}/api/v1/signature/credential/list`, {params: req});
}
