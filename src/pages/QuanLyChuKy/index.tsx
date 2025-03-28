import UploadFile from "@/components/Upload/UploadFile";
import { getDsKyApi, suaChuKy, taoChuKy, xoaChuKy } from "@/services/GiaoDienKy/api";
import { CKieuHienThi, CLoaiChuKy, EKieuHienThi, ELoaiChuKy } from "@/services/GiaoDienKy/constant";
import { FileInfo } from "@/services/GiaoDienKy/typing";
import rules from "@/utils/rules";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Modal, notification, Popconfirm, Row, Select, Spin, Table, Tooltip } from "antd"
import { useForm } from "antd/lib/form/Form";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useEffect, useState } from "react"

export default () => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const [dsKy, setDsKy] = useState<FileInfo[]>();
    const [idEdit, setIdEdit] = useState<string>();

    const onClose = () => {
        form.resetFields();
        setVisibleForm(false);
        setIdEdit(undefined);
    }

    const getDsKy = async () => {
        try {
            setLoading(true);
            const res = await getDsKyApi();
            if (!res) return;
            console.log(res.data.founds);
            setDsKy(res.data.founds);
        } catch (err) { }
        finally {
            setLoading(false);
        }
    }

    const remove = async (id: string) => {
        try {
            setLoading(true);
            const res = await xoaChuKy(id);
            if (res) {
                notification.success({
                    message: 'Xóa chữ ký thành công'
                });
                getDsKy();
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    const columns: ColumnsType<FileInfo> = [
        {
            title: 'TT',
            align: 'center',
            width: 100,
            render: (val, rec, index) => index + 1
        },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Loại', dataIndex: 'type', key: 'type', render: (val: ELoaiChuKy) => ELoaiChuKy[val]},
        { title: 'Kiểu hiển thị', dataIndex: 'display', key: 'display', render: (val: EKieuHienThi) => EKieuHienThi[val]},
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', render: (val) => moment(val).format('HH:mm DD/MM/YYYY') },
        { title: 'Hình chữ ký', render: (val, rec) => <img height={40} src={`http://10.99.3.126:6700/files/${rec.file_path.replace('datas', '')}`}/>},
        {
            title: 'Thao tác',
            align: 'center',
            width: 90,
            fixed: 'right',
            render: (record: FileInfo) => (
                <>
                    <Tooltip title="Chỉnh sửa">
                        <Button onClick={() => {
                            setIdEdit(record.id);
                            setVisibleForm(true);
                            form.setFieldsValue({
                                name: record.name,
                                type: record.type,
                                displayType: record.display,
                                file: record.file_name
                            })
                        }} type="link" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            onConfirm={() => { remove(record.id) }}
                            title="Bạn có chắc chắn muốn xóa chức vụ này?"
                            placement="topLeft"
                        >
                            <Button danger type="link" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    useEffect(() => {
        getDsKy();
    }, [])

    const submit = async (payload: any) => {
        try {
            setLoading(true);
            const signature = {
                name: payload.name,
                type: payload.type,
                display: payload.displayType
            }
            const formData = new FormData();
            formData.append('signature', JSON.stringify(signature));
            formData.append('file_upload', payload.file.fileList[0].originFileObj);
            if (idEdit) {
                const res = await suaChuKy(formData, idEdit);
                if (res) {
                    notification.success({
                        message: 'Sửa chữ ký thành công'
                    })
                }
            } else {
                const res = await taoChuKy(formData);
                if (res) {
                    notification.success({
                        message: 'Tạo chữ ký thành công'
                    })
                }
            }
            onClose();
            getDsKy();
        } catch (err) {
            
        } finally {
            setLoading(false);
        }
    }

    return <>
        <h1>Quản lý chữ ký số</h1>
        <Card>
            <Button icon={<FileAddOutlined />} type="primary" className="mb-4" onClick={() => setVisibleForm(true)}>Thêm chữ ký</Button>
            <Spin spinning={loading}><Table dataSource={dsKy} columns={columns} /></Spin>
        </Card>

        <Modal
            width={800}
            title={`Cập nhật thông tin chữ ký`}
            visible={visibleForm}
            onCancel={onClose}
            okButtonProps={{ loading: loading }}
            onOk={form.submit}

        >
            <Form form={form} onFinish={submit} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={24} md={12}>
                        <Form.Item name="name" rules={[...rules.required]} label="Tên chữ ký">
                            <Input placeholder="Nhập tên chữ ký" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="type" rules={[...rules.required]} label="Loại chữ ký">
                            <Select options={CLoaiChuKy} placeholder="Chọn loại chữ ký" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="displayType" rules={[...rules.required]} label="Kiểu hiển thị">
                            <Select options={CKieuHienThi} placeholder="Chọn kiểu hiển thị" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="file" rules={[...rules.required]} label="Hình ảnh chữ ký">
                            <UploadFile accept=".jpg, .png" maxCount={1} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}