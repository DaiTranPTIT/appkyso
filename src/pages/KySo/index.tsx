import UploadFile from "@/components/Upload/UploadFile";
import { Button, Card, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import rules from "@/utils/rules";
import { buildUpLoadFile } from "@/services/uploadFile";

export default () => {
    const [form] = useForm();

    const submitForm = async(data: any) => {
        const res = await buildUpLoadFile(data, 'file');
        window.open(`/sign?fileName=${res}`, "_blank");
    }
    
    return <Card bodyStyle={{ height: '100%' }}>
    <div className='home-welcome'>
        <h1 className='title'>Dịch vụ ký số</h1>

        <Form form={form} onFinish={submitForm}>
            <Form.Item name="file" rules={[...rules.required]}>
                <UploadFile drag={true} maxCount={1}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">Ký số</Button>
            </Form.Item>
        </Form>
    </div>
</Card>;
}