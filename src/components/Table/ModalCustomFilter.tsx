import { CloseOutlined, FilterFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { findFiltersInColumns } from './function';
import RowFilter from './RowFilter';
import { type IColumn, type TFilter } from './typing';
import { useIntl } from 'umi';

const ModalCustomFilter = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	columns: IColumn<any>[];
	filters: TFilter<any>[];
	setFilters: any;
}) => {
	const intl = useIntl();
	const { visible, setVisible, columns, filters, setFilters } = props;
	const [filtersTemp, setFiltersTemp] = useState<TFilter<any>[]>([]);
	const [form] = Form.useForm();
	const fieldsFiltered = filtersTemp.map((item) => JSON.stringify(item.field));
	const fieldsFilterable = columns
		.filter((item) => item.filterType && item.dataIndex && !fieldsFiltered.includes(JSON.stringify(item.dataIndex)))
		.map((item) => JSON.stringify(item.dataIndex));

	useEffect(() => {
		const fil = findFiltersInColumns(columns, filters);
		setFiltersTemp(fil ?? []);
		if (visible) form.setFieldsValue({ filters: fil });
	}, [filters, visible]);

	const onFinish = (values: any) => {
		const filtered = values.filters
			?.map((filter: TFilter<any>, index: number) => ({
				...filter,
				...filtersTemp[index],
				values: Array.isArray(filter.values[0]) ? filter.values[0] : filter.values,
			}))
			?.filter((filter: TFilter<any>) => filter.values && Array.isArray(filter.values));
		setFilters(filtered);
		setVisible(false);
	};

	return (
		<Modal
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			title={intl.formatMessage({ id: 'global.table.customfilter.title' })}
		>
			<p>{intl.formatMessage({ id: 'global.table.customfilter.dieukien' })}:</p>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				{filtersTemp.map((filter, index) => (
					<RowFilter
						index={index}
						columns={columns}
						key={filter.field.toString()}
						filter={filter}
						fieldsFilterable={fieldsFilterable}
						onChange={(fil) => {
							const temp = [...filtersTemp];
							temp[index] = fil;
							setFiltersTemp(temp);
						}}
					/>
				))}

				<Form.Item>
					<Button
						block
						type='dashed'
						disabled={!fieldsFilterable.length}
						icon={<PlusOutlined />}
						onClick={() => {
							setFiltersTemp([
								...filtersTemp,
								{
									active: true,
									field: fieldsFilterable[0]?.toString() ?? '',
									values: [],
								},
							]);
						}}
					>
						{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
					</Button>
				</Form.Item>

				<Space size={8} wrap style={{ marginTop: 24, justifyContent: 'center', width: '100%' }}>
					<Button htmlType='submit' type='primary' icon={<FilterFilled />}>
						{intl.formatMessage({ id: 'global.table.customfilter.button.apdung' })}
					</Button>
					<Button
						danger
						icon={<CloseOutlined />}
						onClick={() => {
							form.resetFields();
							setFiltersTemp([]);
							setFilters(undefined);
							setVisible(false);
						}}
					>
						{intl.formatMessage({ id: 'global.table.customfilter.button.xoa' })}
					</Button>
					<Button onClick={() => setVisible(false)}>
						{intl.formatMessage({ id: 'global.table.customfilter.button.huy' })}
					</Button>
				</Space>
			</Form>
		</Modal>
	);
};

export default ModalCustomFilter;
