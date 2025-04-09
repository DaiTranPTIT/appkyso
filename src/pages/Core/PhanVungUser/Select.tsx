import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select Phân vùng dữ liệu của tôi
 */
const SelectPhanVungCuaToi = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	hasDefault?: boolean;
	disabled?: boolean;
	hideAll?: boolean;
	isSetRecord?: boolean;
	size?: 'large' | 'middle' | 'small';
}) => {
	const {
		value,
		onChange,
		multiple,
		allowClear,
		placeholder,
		style,
		hasDefault,
		disabled,
		hideAll,
		isSetRecord,
		size,
	} = props;
	const { danhSach, getAllModel, loading } = useModel('core.phanvunguser');
	const danhSachPhanVung = danhSach?.map((item) => ({
		ma: item.dataPartitionCode,
		ten: item.dataPartition?.name,
	}));
	const dataHienThi =
		hasDefault || hideAll ? danhSachPhanVung : [{ _id: null, ten: 'Tất cả phân vùng', ma: null }, ...danhSachPhanVung];

	useEffect(() => {
		if (!danhSach.length)
			getAllModel(!!isSetRecord, undefined, undefined, undefined, 'many/me').then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && !!onChange) onChange(data?.[0]?.dataPartition?.ma);
			});
		else if (hasDefault && !!onChange) onChange(danhSach?.[0]?.dataPartition?.ma);
	}, []);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value || null}
			loading={loading}
			onChange={onChange}
			options={dataHienThi.map((item) => ({
				key: item.ma,
				value: item.ma,
				label: item?.ten ?? item.ma,
			}))}
			showSearch
			size={size}
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn phân vùng dữ liệu'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectPhanVungCuaToi;
