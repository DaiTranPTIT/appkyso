interface FileInfo {
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
    founds: FileInfo[],
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