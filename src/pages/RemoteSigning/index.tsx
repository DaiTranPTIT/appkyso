import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Card, Col, Form, Input, Modal, notification, Pagination, Row, Spin } from "antd";
import { base64ToFile } from "@/utils/function";
import Draggable from "react-draggable";
import { FileInfo, SignHashRequest } from "@/services/GiaoDienKy/typing";
import { apiKy, getDsKyApi } from "@/services/GiaoDienKy/api";
import { AuditOutlined, CloseOutlined } from "@ant-design/icons";
import './style.less';
import axios from "axios";
import { apiGateway } from "@/utils/ip";
import { useLocation, useParams } from "react-router";
import { useForm } from "antd/lib/form/Form";
import rules from "@/utils/rules";
import Password from "antd/lib/input/Password";
type ParamsType = {
  id: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default () => {
  const { id } = useParams<ParamsType>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [dsKy, setDsKy] = useState<FileInfo[]>();
  const [isDragging, setIsDragging] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null);
  const [chuKyDrop, setChuKyDrop] = useState<FileInfo>();
  const [chuKySelected, setChuKySelected] = useState<FileInfo>();
  const [loading, setLoading] = useState(false);
  const [loadingKy, setLoadingKy] = useState<boolean>(false);
  const [form] = useForm();
  const location = useLocation<any>();
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [pointInSign, setPointInSign] = useState<{x: number, y: number, width: number, height: number}>(
    {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  );


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    getDsKy();
    getSignInfo();
  }, []);

  const getSignInfo = async () => {
    try {
      const signInfo = location.query;
      console.log(signInfo)
      const getFile = await axios.get(`${apiGateway}/api/v1/signature/get_pdf/`, {
        params: signInfo
      })
      if (!getFile) return;
      const file = await base64ToFile(getFile.data.pdf_base64, "sample-local-pdf.pdf");
      if (file) {
        setPdfFile(file);
      }
    } catch (err) {
    }
  }

  const handleDragStart = (e: React.DragEvent, chuKy: FileInfo) => {
    if (!dragStartPosition.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      dragStartPosition.current = { x: offsetX, y: offsetY };
      setPointInSign({x: offsetX, y: offsetY, width: rect.width, height: rect.height})
    }
    setChuKySelected(chuKy);
    setIsDragging(true);
  };

  const sign = async (req: SignHashRequest) => {
    const formData = new FormData();
    formData.append("sign_info_id", req.sign_info_id);
    formData.append("signature_id", req.signature_id);
    formData.append("credential_id", req.credential_id);
    formData.append("os", req.os);
    formData.append("width", req.width.toString());
    formData.append("height", req.height.toString());
    formData.append("point_x", req.point_x.toString());
    formData.append("point_y", req.point_y.toString());
    formData.append("page_sign", req.page_sign.toString());
    formData.append("computer_name", req.computer_name);
    formData.append("mac", req.mac);
    formData.append("merchant_id", req.merchant_id);
    formData.append("password", req.password);
    formData.append("user_Name", req.user_Name);
    setLoadingKy(true);
    try {
      setLoadingKy(true);
      const res = await apiKy(formData);
      console.log(res);
    } catch (err) {
    } finally {
      setLoadingKy(false);
    }
  }

  const getDsKy = async () => {
    try {
      setLoading(true);
      const res = await getDsKyApi();
      if (!res) return;
      setDsKy(res.data.founds);
    } catch (err) { }
    finally {
      setLoading(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (pdfContainerRef.current) {
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left - pointInSign.x + 10;
      const y = e.clientY - containerRect.top - pointInSign.y;

      // Kiểm tra xem có thả vào vùng PDF không
      if (x >= 0 && x <= containerRect.width && y >= 0 && y <= containerRect.height) {
        setSignaturePosition({ x, y });
        setChuKyDrop(chuKySelected);
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const showModalUsernamePassword = async () => {
    Modal.confirm({
      title: 'Nhập thông tin tài khoản',
      onOk: () => {
        return new Promise((resolve, reject) => {
          form
            .validateFields()
            .then(values => {
              layToaDo(values);
              resolve(null);
            })
            .catch(() => reject());
        });
      },
      content: (
        <Form form={form} layout="vertical">
          <Form.Item name="username" rules={[...rules.required]} label="Tên đăng nhập">
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item name="password" rules={[...rules.required]} label="Mật khẩu">
            <Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      )
    });
  }

  const layToaDo = async (acc: {
    username: string,
    password: string
  }) => {
    if (pdfContainerRef.current && signatureRef.current) {
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      const signatureRect = signatureRef.current.getBoundingClientRect();

      const x = signatureRect.left - containerRect.left;
      const y = containerRect.bottom - signatureRect.bottom;
      const container_width = containerRect.width;
      const container_height = containerRect.height;
      const sign_width = signatureRect.width;
      const sign_height = signatureRect.height;

      const point_x = x / container_width * 100;
      const point_y = y / container_height * 100;
      const width = sign_width / container_width * 100;
      const height = sign_height / container_height * 100;

      console.log(point_x, ' - ', point_y, ' - ', width, ' - ', height);

      const req = {
        sign_info_id: id,
        signature_id: chuKySelected?.id || '',
        credential_id: chuKySelected?.credential_id || '',
        os: window.navigator.userAgent,
        width: width,
        height: height,
        point_x: point_x,
        point_y: point_y,
        page_sign: currentPage,
        computer_name: "Computer",
        mac: "00-00-00-00-00-00",
        merchant_id: "VIETTEL",
        password: acc.password,
        user_Name: acc.username
      }

      await sign(req);
      notification.success({
        message: 'Ký thành công',
        description: 'Văn bản của bạn đã được ký số!',
      });
      setLoading(false);
      getSignInfo();
      removeChuKy();
    }
  };

  const removeChuKy = () => {
    setSignaturePosition(null);
    setChuKySelected(undefined);
    setChuKyDrop(undefined);
  }

  return (
    <div style={{ background: '#f4f4f4' }}>
      {isDragging && <div className="overlay"></div>}
      <div className="flex justify-between gap-[40px]">
        <div className="w-[400px] bg-white border-gray-500 p-4 rounded shadow-md">
          <h2 className="mb-4"><strong>Mẫu chữ ký</strong></h2>
          <Card style={{ height: 'auto', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            <Spin spinning={loading}>
              <Row gutter={[10, 10]}>
                {
                  dsKy?.map(item => <Col span={24}>
                    <div className="flex items-center gap-[10px]">
                      <div
                        onDrag={e => handleDragStart(e, item)}
                        onDragEnd={e => {
                          setIsDragging(false);
                          dragStartPosition.current = null;
                          console.log(pointInSign);
                        }}
                        className="cursor-move rounded shadow-md"
                        draggable="true"
                      >
                        <img src={`https://digital-signature.ript.vn/api/files/${item.file_path.replace('datas', '')}`} width={'100px'} alt="Signature" />
                      </div>
                      <strong>{item.name}</strong>
                    </div>
                  </Col>)
                }
              </Row>
            </Spin>
          </Card>
          <button className="button-27" role="button" onClick={showModalUsernamePassword}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
          </svg> Ký số</button>
        </div>

        <div className="w-[calc(100%-400px)] margin-[auto] h-[100vh] overflow-auto py-4">
          <Pagination simple current={currentPage} total={numPages} className="mb-[20px] flex justify-center mb-4" onChange={(e) => setCurrentPage(Number(e))} defaultPageSize={1} />
          {pdfFile && <div
            className={`relative border-2 border-dashed border-${isDragging ? 'blue-500' : 'grey'} p-2 container-drag w-[max-content] bg-${isDragging ? 'blue-50' : ''} mx-[auto]`}

          >
            {(
              <div ref={pdfContainerRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
              </div>

            )}

            {signaturePosition && <Draggable
              onStop={() => setIsDragging(false)}
              onStart={() => setIsDragging(true)}
              bounds={"parent"}
              handle=".cursor-move"
              defaultPosition={{ 
                x: signaturePosition.x, 
                y: signaturePosition.y - (pdfContainerRef.current?.getBoundingClientRect().height || 0)
              }}
            >

              <div id="chuKy"
                ref={signatureRef}
                className="absolute"
              >
                <div className="absolute close-button" onClick={removeChuKy}><CloseOutlined style={{ fontSize: '8px' }} /></div>
                <img className="cursor-move" src={`https://digital-signature.ript.vn/api/files/${chuKyDrop?.file_path.replace('datas', '')}`} width={100} alt="Signature" />
              </div>
            </Draggable>}
          </div> || <Spin className="flex items-center w-[100%]"/>}
        </div>
      </div>
      <Modal title="Xác nhận ký" visible={loadingKy} footer={false} onCancel={() => setLoadingKy(false)}>
        {loadingKy && <div className="signing">
          <img src="/kyso/signing.gif" width={150} />
          <strong>Đang chờ xác nhận...</strong>
        </div>}
      </Modal>
    </div>

  );
};