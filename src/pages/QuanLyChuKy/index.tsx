import UploadFile from "@/components/Upload/UploadFile";
import { getDsKyApi, getListCredentialApi, suaChuKy, taoChuKy, xoaChuKy } from "@/services/GiaoDienKy/api";
import { CKieuHienThi, CLoaiChuKy, EKieuHienThi, ELoaiChuKy } from "@/services/GiaoDienKy/constant";
import { FileInfo, ICredential } from "@/services/GiaoDienKy/typing";
import rules from "@/utils/rules";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Modal, notification, Popconfirm, Radio, Row, Select, Spin, Table, Tag, Tooltip } from "antd"
import { useForm } from "antd/lib/form/Form";
import Password from "antd/lib/input/Password";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useEffect, useState } from "react"

export default () => {
    const [visibleForm, setVisibleForm] = useState<'NEW' | 'EDIT'>();
    const [credForm] = useForm();
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const [dsKy, setDsKy] = useState<FileInfo[]>();
    const [idEdit, setIdEdit] = useState<string>();

    const onClose = () => {
        form.resetFields();
        setVisibleForm(undefined);
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
        { title: 'Loại', dataIndex: 'type', key: 'type', render: (val: ELoaiChuKy) => ELoaiChuKy[val] },
        { title: 'Kiểu hiển thị', dataIndex: 'display', key: 'display', render: (val: EKieuHienThi) => EKieuHienThi[val] },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', render: (val) => moment(val).format('HH:mm DD/MM/YYYY') },
        { title: 'Hình chữ ký', render: (val, rec) => <img style={{ height: '40px' }} src={`https://digital-signature.ript.vn/api/files/${rec.file_path.replace('datas', '')}`} /> },
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
                            setVisibleForm('EDIT');
                            form.setFieldsValue({
                                name: record.name,
                                type: record.type,
                                displayType: record.display,
                                file: record.file_name,
                                credential_id: record.credential_id
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

    const submit = async (payload: any, credential_id?: string) => {
        try {
            setLoading(true);
            const signature = {
                name: payload.name,
                type: payload.type,
                display: payload.displayType,
                credential_id: credential_id
            }
            const formData = new FormData();
            formData.append('signature', JSON.stringify(signature));
            if (payload.file.fileList[0].originFileObj) formData.append('file_upload', payload.file.fileList[0].originFileObj);
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

    const getListCredential = async (val: any) => {
        try {
            setLoading(true);
            const res = await getListCredentialApi(val);
            if (res.data.code === 400) {
                notification.error({
                    message: "Thất bại",
                    description: "Tài khoản không tồn tại",
                });
                return;
            }

            console.log(res.data.result);

            Modal.confirm({
                width: 600,
                title: 'Chọn CRED',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        credForm
                            .validateFields()
                            .then(values => {
                                submit(val, values.credential_id);
                                resolve(null);
                            })
                            .catch(() => reject());
                    });
                },
                content: (
                    <Form form={credForm} onFinish={val => submit(val)}>
                        <Form.Item name="credential_id" rules={[...rules.required]}>
                            <Radio.Group style={{width: '100%'}}>
                                <Table
                                    rowKey="credential_id"
                                    columns={[
                                        {
                                          title: "",
                                          dataIndex: "credential_id",
                                          render: (_: any, record: any) => (
                                            <Radio value={record.credential_id} />
                                          ),
                                        },
                                        {
                                          title: "Cred",
                                          dataIndex: "credName",
                                        },
                                        {
                                            title: "Trạng thái",
                                            dataIndex: "status",
                                            render: val => {
                                                console.log(val);
                                                switch (val) {
                                                    case "OPERATED": 
                                                        return <Tag color="green">Hoạt động</Tag>;
                                                    default: 
                                                        return <Tag color="red">Không hoạt động</Tag>;
                                                }
                                            }
                                        },
                                    ]}
                                    dataSource={res.data.result.map((item: any) => {
                                        return {
                                            credential_id: item.credential_id,
                                            credName: item.credential_id,
                                            status: item.status
                                        }
                                    })}
                                    pagination={false}
                                />
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                )
            });
            onClose();
        } catch (err) {
        } finally {
            setLoading(false);

        }
    }

    return <>
        <h2 className="mb-4">Quản lý chữ ký số</h2>
        <Card>
            <Button icon={<FileAddOutlined />} type="primary" style={{ marginBottom: '10px' }} onClick={() => setVisibleForm('NEW')}>Thêm chữ ký</Button>
            <Spin spinning={loading}><Table dataSource={dsKy} columns={columns} /></Spin>
        </Card>

        <Modal
            width={800}
            title={`Cập nhật thông tin chữ ký`}
            visible={Boolean(visibleForm)}
            onCancel={onClose}
            okButtonProps={{ loading: loading }}
            onOk={form.submit}

        >
            <Form form={form} onFinish={visibleForm === 'NEW' && getListCredential || submit} layout="vertical">
                <Row gutter={[16, 16]}>
                    {visibleForm === 'NEW' && <Col span={24} md={12}>
                        <Form.Item name="username" rules={[...rules.required]} label="Tên đăng nhập">
                            <Input placeholder="Nhập tên đăng nhập" />
                        </Form.Item>
                    </Col>}

                    {visibleForm === 'NEW' && <Col span={24} md={12}>
                        <Form.Item name="password" rules={[...rules.required]} label="Mật khẩu">
                            <Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>}
                    <Form.Item name="credential_id" hidden={true}>
                        <Input />
                    </Form.Item>
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