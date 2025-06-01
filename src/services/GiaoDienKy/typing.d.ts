import { ETypeKy } from "./constant";

interface IChuKy {
    id: string;
    file_path: string;
    file_name: string;
    type: string;
    display: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    name: string;
    credential_id: string;
}

export interface IGetSign {
    founds: IChuKy[],
    search_options: {
        ordering: string
        page: number
        page_size: number
        total_count: number
    }
}

interface ICredential {
    credential_id: string;
    authorization_email: string | null;
    authorization_phone: string | null;
    valid_from: string | null;
    valid_to: string | null;
    purpose: string | null;
    version: number;
    status: "OPERATED" | string;
    status_desc: string;
}

export interface SignHashRequest {
    signature_id: string;
    credential_id: string;
    os: string;
    width: number;
    height: number;
    point_x: number;
    point_y: number;
    page_sign: number;
    computer_name: string;
    mac: string;
    merchant_id: string;
    password: string;
    user_Name: string;
    sign_info_id: string;
}

export interface ISignInfo {
    file_link: string;
    file_upload_handler: string;
    session_id: string;
    jwt_token: string | null;
    meta_data: MetaData[];
    type: ETypeKy;
}