import { type Login } from './typing';

export enum EModuleKey {
	CONNECT = 'cong-hoc-vien',
	CONG_CAN_BO = 'cong-can-bo',
	QLDT = 'quan-ly-dao-tao',
	CORE = 'danh-muc-chung',
	TCNS = 'to-chuc-nhan-su',
	CTSV = 'cong-tac-sinh-vien',
	VPS = 'van-phong-so',
	TC = 'tai-chinh',
	QLKH = 'quan-ly-khoa-hoc',
	KT = 'khao-thi',
	CSVC = 'co-so-vat-chat',
	THU_VIEN = 'thu-vien',
}

export const AppModules: Record<EModuleKey, Login.TModule> = {
	[EModuleKey.CONNECT]: {
		title: APP_CONFIG_TITLE_CONNECT,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: APP_CONFIG_URL_CONNECT,
		icon: EModuleKey.CONNECT + '.svg',
	},
	[EModuleKey.CONG_CAN_BO]: {
		title: APP_CONFIG_TITLE_CAN_BO,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: APP_CONFIG_URL_CAN_BO,
		icon: EModuleKey.CONG_CAN_BO + '.svg',
	},
	[EModuleKey.CORE]: {
		title: APP_CONFIG_TITLE_CORE,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}core`,
		url: APP_CONFIG_URL_CORE,
		icon: EModuleKey.CORE + '.svg',
	},
	[EModuleKey.QLDT]: {
		title: APP_CONFIG_TITLE_DAO_TAO,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt`,
		url: APP_CONFIG_URL_DAO_TAO,
		icon: EModuleKey.QLDT + '.svg',
	},
	[EModuleKey.TCNS]: {
		title: APP_CONFIG_TITLE_NHAN_SU,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tcns`,
		url: APP_CONFIG_URL_NHAN_SU,
		icon: EModuleKey.TCNS + '.svg',
	},
	[EModuleKey.CTSV]: {
		title: APP_CONFIG_TITLE_CTSV,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}ctsv`,
		url: APP_CONFIG_URL_CTSV,
		icon: EModuleKey.CTSV + '.svg',
	},
	[EModuleKey.VPS]: {
		title: APP_CONFIG_TITLE_VPS,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}vps`,
		url: APP_CONFIG_URL_VPS,
		icon: EModuleKey.VPS + '.svg',
	},
	[EModuleKey.QLKH]: {
		title: APP_CONFIG_TITLE_QLKH,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qlkh`,
		url: APP_CONFIG_URL_QLKH,
		icon: EModuleKey.QLKH + '.svg',
	},
	[EModuleKey.TC]: {
		title: APP_CONFIG_TITLE_TAI_CHINH,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc`,
		url: APP_CONFIG_URL_TAI_CHINH,
		icon: EModuleKey.TC + '.svg',
	},
	[EModuleKey.KT]: {
		title: APP_CONFIG_TITLE_KHAO_THI,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}kt`,
		url: APP_CONFIG_URL_KHAO_THI,
		icon: EModuleKey.KT + '.svg',
	},
	[EModuleKey.CSVC]: {
		title: APP_CONFIG_TITLE_CSVC,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}csvc`,
		url: APP_CONFIG_URL_CSVC,
		icon: EModuleKey.CSVC + '.svg',
	},
	[EModuleKey.THU_VIEN]: {
		title: APP_CONFIG_TITLE_THU_VIEN,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}thu-vien`,
		url: APP_CONFIG_URL_THU_VIEN,
		icon: EModuleKey.THU_VIEN + '.svg',
	},
};

// export const moduleThuVien: Partial<Login.TModule> = {
// 	title: APP_CONFIG_TITLE_THU_VIEN,
// 	url: APP_CONFIG_URL_THU_VIEN,
// 	icon: 'thu-vien.svg',
// };

export const moduleQuanLyVanBan: Partial<Login.TModule> = {
	title: APP_CONFIG_TITLE_QLVB,
	url: APP_CONFIG_URL_QLVB,
	icon: 'quan-ly-van-ban.svg',
};

/** Đường link landing page */
export const landingUrl = APP_CONFIG_URL_LANDING;

/** Màu sắc chủ đạo */
export const primaryColor = APP_CONFIG_PRIMARY_COLOR;

/** Tên trường Học viện */
export const unitName = APP_CONFIG_TEN_TRUONG;

/** Cơ quan chủ quản của trường */
export const coQuanChuQuan = APP_CONFIG_CO_QUAN_CHU_QUAN;

/** Trường / Học viện */
export const unitPrefix = APP_CONFIG_TIEN_TO_TRUONG;

/** Tên tiếng anh của trường */
export const tenTruongVietTatTiengAnh = APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH;

/** Cài đặt hệ thống */
export enum ESettingKey {}
