import { NotificationType } from '@/services/ThongBao/constant';
import { Card } from 'antd';
import TabViewThongBao from './TabViewThongBao';

const ThongBaoEmailPage = () => {
	return (
		<Card title='Thông báo Email'>
			<TabViewThongBao notiType={NotificationType.EMAIL} />;
		</Card>
	);
};

export default ThongBaoEmailPage;
