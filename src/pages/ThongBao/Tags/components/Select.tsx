import { Select, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTag = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: CSSProperties;
}) => {
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, style } = props;
	const { danhSach, loading, getAllModel } = useModel('thongbao.tags');

	useEffect(() => {
		if (loadData !== false) getAllModel();
	}, []);

	return (
		<Select
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.ten}`,
			}))}
			style={style}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn nhãn dán'}
		/>
	);
};

export default SelectTag;
