import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

// Ip Chính => Mặc định dùng trong các useInitModel
const ip3 = ipRoot + 'tcns'; // ip dev

// Ip khác
const ipNotif = ipRoot + 'notification'; // ip dev
const ipSlink = ipRoot + 'slink'; // ip dev
const ipCore = ipRoot + 'core'; // ip dev

const currentRole = EModuleKey.TCNS;
const replaceRole: EModuleKey | undefined = undefined; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ
const oneSignalRole = EModuleKey.CONG_CAN_BO;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	currentRole,
	replaceRole,
	ip3,
	ipCore,
	ipNotif,
	ipSlink,
	keycloakAuthEndpoint,
	keycloakAuthority,
	keycloakClientID,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	oneSignalClient,
	oneSignalRole,
	resourceServerClientId,
	sentryDSN,
};
