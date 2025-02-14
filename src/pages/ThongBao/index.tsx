import { NotificationType } from '@/services/ThongBao/constant';
import { Card } from 'antd';
import TabViewThongBao from './TabViewThongBao';

const ThongBaoPage = () => {
	return (
		<Card title='Thông báo ứng dụng'>
			<TabViewThongBao notiType={NotificationType.ONESIGNAL} />
		</Card>
	);
};

export default ThongBaoPage;
