export interface ILogKy {
    founds: FoundItem[],
    search_options: {
        ordering: string,
        page: number,
        page_size: number,
        total_count: number
    }
}


interface MetaData {
    Key: string;
    Value: number;
}

interface FoundItem {
    id: string;
    session_id: string;
    jwt_token: string | null;
    meta_data: MetaData[];
    from_id: string | null;
    signed: boolean | null;
    signed_time: string | null;
    client_ip: string | null;
    created_at: string;
    updated_at: string;
    file_link: string;
    file_upload_handler: string;
    user_id: string;
}