import { Modal, Progress } from 'antd';
import defaultSettings from '../../../config/defaultSettings';
import { useIntl } from 'umi';

// eslint-disable-next-line react-hooks/rules-of-hooks
const intl = useIntl();

const FormWaiting = (s = intl.formatMessage({ id: 'global.formWaiting.title' })) => {
	Modal.info({
		title: intl.formatMessage({ id: 'global.formWaiting.dangxuly' }),
		centered: true,
		icon: null,
		okButtonProps: { hidden: true },
		content: (
			<div style={{ textAlign: 'center' }}>
				<Progress percent={100} status='active' showInfo={false} strokeColor={defaultSettings.primaryColor} />
				<span>{s}</span>
				<br />
				<small>
					<i>({intl.formatMessage({ id: 'global.formWaiting.thongbao' })})</i>
				</small>
			</div>
		),
	});
};

export default FormWaiting;
