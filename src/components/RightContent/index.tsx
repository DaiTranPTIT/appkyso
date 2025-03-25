import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { history, useIntl, useModel } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import LocaleSwitch from './LocaleSwitch';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	return (
		<div className={styles.right}>
			<ModuleSwitch />

			<NoticeIconView />

			<Tooltip
				title={intl.formatMessage({ id: 'app.header.introduce', defaultMessage: 'Giới thiệu chung' })}
				placement='bottom'
			>
				<a onClick={() => history.push('/gioi-thieu')}>
					<InfoCircleOutlined />
				</a>
			</Tooltip>

			<LocaleSwitch />

			<AvatarDropdown />
		</div>
	);
};

export default GlobalHeaderRight;
