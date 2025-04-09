import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select Tất cả phân vùng dữ liệu hệ thống
 */
const SelectPhanVungDuLieu = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	hasDefault?: boolean;
	disabled?: boolean;
	hideAll?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, style, hasDefault, disabled, hideAll } = props;
	const { danhSach, getAllModel, loading } = useModel('core.phanvungdulieu');
	const dataHienThi =
		hasDefault || hideAll ? danhSach : [{ _id: null, name: 'Tất cả phân vùng', ma: null }, ...danhSach];

	useEffect(() => {
		if (!danhSach.length)
			getAllModel().then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && !!onChange) onChange(data?.[0]?.ma);
			});
		else if (hasDefault && !!onChange) onChange(danhSach?.[0]?.ma);
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
				key: item._id,
				value: item.ma,
				label: item?.name ?? item.ma,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn phân vùng dữ liệu'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectPhanVungDuLieu;
