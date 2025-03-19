import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import type { AuditLog } from '@/services/TienIch/AuditLog/typing';
import { Button, Card, Col, Descriptions, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Link, useModel } from 'umi';

const renderSection = (label: string, data: any) => (
	<Col span={24}>
		<div className='fw500'>{label}:</div>
		{data ? <pre>{JSON.stringify(data ?? {}, undefined, 2)}</pre> : null}
	</Col>
);

const ModalAuditLog = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	actions?: Record<any, string>;
	condition?: Partial<AuditLog.IRecord>;
	/** Trường hợp sử dụng model auditLog khác mặc định (thay đổi IP chẳng hạn) */
	modelName?: string;
	children?: React.ReactNode;
}) => {
	const {
		visible,
		setVisible,
		actions = {},
		title = 'Lịch sử thao tác',
		modelName = 'tienich.auditlog',
		condition,
	} = props;
	const { page, limit, getModel, setRecord, record, loading, getByIdModel } = useModel(modelName as any);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [paneSize, setPaneSize] = useState('60%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	useEffect(() => {
		setShowDetail(false);
	}, [record?._id]);

	const getData = () =>
		getModel(
			condition,
			[{ field: 'action', values: Object.keys(actions), operator: EOperatorType.INCLUDE }],
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			['-data', '-response', '-error', '-query'],
		).then((res: any) => setRecord(res?.[0]));

	const handleShowDetail = () => {
		if (record?._id) getByIdModel(record?._id).then(() => setShowDetail(true));
	};

	const onCell = (rec: AuditLog.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<AuditLog.IRecord>[] = [
		{ title: 'TT', dataIndex: 'index', align: 'center', width: 50, onCell },
		{
			title: 'Mã người dùng',
			dataIndex: 'uCode',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'uName',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Hành động',
			dataIndex: 'action',
			width: 180,
			filterType: 'select',
			filterData: Object.keys(actions).map((i) => ({ label: actions[i], value: i })),
			render: (val) => val && actions[val],
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian',
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm:ss, DD/MM/YYYY'),
			onCell,
		},
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 90,
		// 	fixed: 'right',
		// 	render: (val, rec) => (
		// 		<>
		// 			<ButtonExtend
		// 				tooltip='Chi tiết'
		// 				onClick={() => rec._id && getByIdModel(rec._id).then(handleView)}
		// 				type='link'
		// 				icon={<EyeOutlined />}
		// 			/>
		// 			<ButtonExtend
		// 				tooltip='Cập nhật'
		// 				onClick={() => onCapNhat(rec)}
		// 				className='btn-warning'
		// 				type='link'
		// 				icon={<RetweetOutlined />}
		// 			/>
		// 		</>
		// 	),
		// },
	];

	return (
		<Modal title={title} visible={visible} onCancel={() => setVisible(false)} footer={null} width={1400}>
			{props.children}

			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='30%'>
					<Card
						title='Danh sách thao tác'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0' }}
						headStyle={{ padding: 0 }}
					>
						<TableBase
							columns={columns}
							dependencies={[page, limit, JSON.stringify(condition)]}
							modelName={modelName}
							getData={getData}
							hideCard
							buttons={{ create: false }}
							otherProps={{ size: 'small' }}
							addStt={false}
						/>
					</Card>
				</Pane>

				<Pane minSize='30%'>
					<Card
						title='Chi tiết thao tác'
						bordered={false}
						bodyStyle={{ padding: '8px 0 0', maxHeight: 630, overflowY: 'auto' }}
						headStyle={{ padding: 0 }}
					>
						<Spin spinning={loading}>
							<Descriptions column={1}>
								<Descriptions.Item label='Mã người dùng'>{record?.uCode ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Họ tên'>{record?.uName ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Địa chỉ Email'>{record?.uEmail ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Thao tác người dùng'>
									{record?.action ? actions[record?.action] : '--'}
									{record?.description ? ` (${record?.description})` : null}
								</Descriptions.Item>

								<Descriptions.Item label='Địa chỉ IP'>{record?.ip ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Trình duyệt/Thiết bị'>{record?.userAgent ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Phương thức truy cập'>{record?.requestType ?? '--'}</Descriptions.Item>

								{record?._id && !showDetail && (
									<Descriptions.Item label='Tham số đầu vào, dữ liệu trả về'>
										<Link
											to=''
											onClick={(e) => {
												e.preventDefault();
												handleShowDetail();
											}}
										>
											Xem chi tiết
										</Link>
									</Descriptions.Item>
								)}
							</Descriptions>

							{showDetail ? (
								<Row gutter={[0, 16]}>
									{renderSection('Dữ liệu', record?.data)}
									{renderSection('Tham số', record?.param)}
									{renderSection('Truy vấn', record?.query)}
									{renderSection('Dữ liệu trả về', record?.response)}
								</Row>
							) : null}
						</Spin>
					</Card>
				</Pane>
			</SplitPane>

			<div className='form-footer' style={{ marginTop: 18 }}>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};

export default ModalAuditLog;
