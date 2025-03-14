import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import rules from '@/utils/rules';
const { TextArea } = Input;

const FormTags = () => {
	const { setVisibleForm, edit, record, postModel, putModel } = useModel('thongbao.tags');
	const [form] = Form.useForm();
	const handleFinish = async (values: any) => {
		try {
			if (edit) {
				putModel(record?._id, { ...values });
			} else {
				postModel({ ...values });
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (edit) {
			form.setFieldsValue({ ...record });
		}
	}, [record, edit]);

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={handleFinish} form={form} layout={'vertical'}>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label={'Tên nhãn dán'} name={'ten'} rules={[...rules.required]}>
							<Input placeholder={'Nhập tên nhãn'} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={'Mô tả'} name={'moTa'} rules={[...rules.required]}>
							<TextArea placeholder={'Nhập mô tả'} rows={3} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Form.Item>
								<Button style={{ marginRight: 8 }} htmlType={'submit'} type={'primary'}>
									Lưu
								</Button>
								<Button
									onClick={() => {
										setVisibleForm(false);
									}}
								>
									Đóng
								</Button>
							</Form.Item>
						</div>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};
export default FormTags;
