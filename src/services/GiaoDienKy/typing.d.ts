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
