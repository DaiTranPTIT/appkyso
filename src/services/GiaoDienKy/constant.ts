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

export enum ETypeKy {
    vgca_usb_token='usb',
    vgca_remote_token='remote',
    vgca_sim_token='sim'
}

