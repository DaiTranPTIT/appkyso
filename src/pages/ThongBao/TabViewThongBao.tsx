import { TabViewPage } from '@/components/TabViewPage';
import type { NotificationType } from '@/services/ThongBao/constant';
import CardThongBao from './CardThongBao';

const TabViewThongBao = (props: { notiType: NotificationType }) => {
	const { notiType } = props;
	const paths = ['ban-hanh', 'tu-dong'];
	const titles = ['Ban hành thông báo', 'Thông báo tự động'];

	const menus = [
		{
			title: titles[0],
			menuKey: paths[0],
			content: <CardThongBao notiType={notiType} activeKey='ban_hanh' />,
		},
		{
			title: titles[1],
			menuKey: paths[1],
			content: <CardThongBao notiType={notiType} activeKey='tu_dong' />,
		},
	];

	return <TabViewPage hideCard menu={menus} />;
};

export default TabViewThongBao;
