import { Modal, Progress } from 'antd';
import defaultSettings from '../../../config/defaultSettings';

const FormWaiting = (s: string, intl?: any) => {
	Modal.info({
		title: intl?.formatMessage({ id: 'global.formWaiting.dangxuly' }) ?? 'Đang xử lý dữ liệu...',
		centered: true,
		icon: null,
		okButtonProps: { hidden: true },
		content: (
			<div style={{ textAlign: 'center' }}>
				<Progress percent={100} status='active' showInfo={false} strokeColor={defaultSettings.primaryColor} />
				<span>{s ?? intl?.formatMessage({ id: 'global.formWaiting.title' }) ?? 'Thông báo'}</span>
				<br />
				<small>
					<i>
						({intl?.formatMessage({ id: 'global.formWaiting.thongbao' }) ?? 'Vui lòng chờ đến khi tiến trình kết thúc!'}
						)
					</i>
				</small>
			</div>
		),
	});
};

export default FormWaiting;
