import { NotificationType } from '@/services/ThongBao/constant';
import { Card } from 'antd';
import CardTabThongBao from './CardTab';

const ThongBaoPage = () => {
	return (
		<Card title='Thông báo ứng dụng'>
			<CardTabThongBao notiType={NotificationType.ONESIGNAL} />
		</Card>
	);
};

export default ThongBaoPage;
