import { Tooltip } from 'antd';
import { useIntl } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from '../NoticeIcon/index.less';
import ModuleView from './ModuleView';

const ModuleSwitch = () => {
	const intl = useIntl();

	return (
		<HeaderDropdown
			placement='bottomRight'
			overlayClassName={styles.popover}
			overlay={<ModuleView />}
			trigger={['click']}
			arrow
		>
			<Tooltip
				title={intl.formatMessage({ id: 'app.header.appdrawer', defaultMessage: 'Danh sách chức năng' })}
				placement='bottom'
			>
				<a className='module-switch-link'>
					<img src='/icon-tien-ich.svg' alt='apps' />
				</a>
			</Tooltip>
		</HeaderDropdown>
	);
};

export default ModuleSwitch;
