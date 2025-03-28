export enum ELoaiChuKy {
    incoming_official_documents = 'Mẫu ký số công văn đến',
    outgoing_official_documents = 'Mẫu số công văn đi',
    date_of_outgoing_official_documents = 'Mẫu ngày công văn đi',
    personal_signature = 'Mẫu chữ ký cá nhân',
    organizational_signature = 'Mẫu chữ ký tổ chức'
}

export const CLoaiChuKy = Object.entries(ELoaiChuKy).map(([value, label]) => ({ label, value }));

export enum EKieuHienThi {
    image = 'Hình ảnh',
    info = 'Thông tin',
    both = 'Kết hợp'
}

export const CKieuHienThi = Object.entries(EKieuHienThi).map(([value, label]) => ({ label, value }));

export interface SignHashRequest {
    signature_id: string;
    credential_id: string;
    os: string;
    file_upload?: File; 
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
}