import { NotificationType } from '@/services/ThongBao/constant';
import { Card } from 'antd';
import CardTabThongBao from './CardTab';

const ThongBaoEmailPage = () => {
	return (
		<Card title='Thông báo Email'>
			<CardTabThongBao notiType={NotificationType.EMAIL} />;
		</Card>
	);
};

export default ThongBaoEmailPage;
