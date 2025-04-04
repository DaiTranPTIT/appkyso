import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import NoticeIcon from './NoticeIcon';

const NoticeIconView = () => {
	const intl = useIntl();
	const {
		danhSach,
		getThongBaoModel,
		total,
		page,
		limit,
		setLimit,
		loading,
		record,
		setRecord,
		unread,
		readNotificationModel,
	} = useModel('thongbao.noticeicon');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [visiblePopup, setVisiblePopup] = useState<boolean>(false);

	useEffect(() => {
		getThongBaoModel();
	}, [page, limit]);

	const clearReadState = async () => {
		readNotificationModel('ALL');
		setVisiblePopup(false);
	};

	return (
		<>
			<NoticeIcon
				count={unread}
				onItemClick={async (item) => {
					setRecord(item);
					setVisibleDetail(true);
					setVisiblePopup(false);
				}}
				loading={loading}
				onClear={() => clearReadState()}
				clearText={intl.formatMessage({ id: 'global.rightcontent.thongbao.cleartext' })}
				viewMoreText={intl.formatMessage({ id: 'global.rightcontent.thongbao.taithem' })}
				onViewMore={() => {
					if (loading) return;
					setLimit(limit + 5);
				}}
				popupVisible={visiblePopup}
				clearClose
				onPopupVisibleChange={(visible) => {
					setVisiblePopup(visible);
				}}
			>
				<NoticeIcon.Tab
					tabKey='notification'
					count={total}
					list={danhSach}
					title={intl.formatMessage({ id: 'global.rightcontent.thongbao.title' })}
					emptyText={intl.formatMessage({ id: 'global.rightcontent.thongbao.emptytext' })}
					showClear={!!unread}
					showViewMore={danhSach.length < total}
				/>
			</NoticeIcon>

			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				destroyOnClose
				onCancel={() => setVisibleDetail(false)}
				visible={visibleDetail}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.rightcontent.thongbao.dong' })}
			>
				<ViewThongBao
					record={record}
					afterViewDetail={() => {
						setVisibleDetail(false);
						setVisiblePopup(false);
					}}
				/>
			</Modal>
		</>
	);
};

export default NoticeIconView;
