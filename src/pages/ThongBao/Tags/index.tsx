import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormTags from './components/Form';
import { ThongBao } from '@/services/ThongBao/typing';

const Tags = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('thongbao.tags');
	const columns: IColumn<ThongBao.Tags>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 280,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (recordVal: ThongBao.Tags) => (
				<>
					<Tooltip title='Sửa'>
						<Button
							onClick={() => {
								handleEdit(recordVal);
							}}
							shape='circle'
							type={'link'}
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								deleteModel(recordVal?._id);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button shape='circle' type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	return (
		<>
			<TableBase
				title={'Quản lý nhãn dán'}
				modelName={'thongbao.tags'}
				columns={columns}
				dependencies={[page, limit]}
				Form={FormTags}
				destroyModal
			/>
		</>
	);
};
export default Tags;
