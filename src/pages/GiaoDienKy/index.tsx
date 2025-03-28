import React, { useState, useRef, useEffect, RefObject } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Card, Col, Modal, Pagination, Row, Spin } from "antd";
import { getFileFromUrl } from "@/utils/function";
import Draggable from "react-draggable";
import { FileInfo } from "@/services/GiaoDienKy/typing";
import { apiKy, getDsKyApi } from "@/services/GiaoDienKy/api";
import { AuditOutlined, CloseOutlined } from "@ant-design/icons";
import { SignHashRequest } from "@/services/GiaoDienKy/constant";
import './style.less';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFSignatureApp: React.FC = () => {
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
  const [visibleForm, setVisibleForm] = useState(false);
  const [loadingKy, setLoadingKy] = useState<false | true | 'cancel'>(false);

  useEffect(() => {
    getDsKy();
    const handleFileChange = async () => {
      try {
        const file = await getFileFromUrl("https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf", "sample-local-pdf.pdf");
        if (file) {
          setPdfFile(file);
        }
      } catch (error) {
        console.error("Lỗi tải PDF:", error);
      }
    };
    handleFileChange();
  }, []);

  const handleDragStart = (e: React.DragEvent, chuKy: FileInfo) => {
    setChuKySelected(chuKy);
    setIsDragging(true);
  };

  const sign = async (req: SignHashRequest) => {
    const formData = new FormData();
    formData.append("signature_id", req.signature_id);
    formData.append("credential_id", req.credential_id);
    formData.append("os", req.os);
    formData.append("width", req.width.toString());
    formData.append("file_upload", req.file_upload || '');
    formData.append("height", req.height.toString());
    formData.append("point_x", req.point_x.toString());
    formData.append("point_y", req.point_y.toString());
    formData.append("page_sign", req.page_sign.toString());
    formData.append("computer_name", req.computer_name);
    formData.append("mac", req.mac);
    formData.append("merchant_id", req.merchant_id);
    formData.append("password", req.password);
    formData.append("user_Name", req.user_Name);
    setVisibleForm(true);
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
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

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

  const layToaDo = async () => {
    if (pdfContainerRef.current && signatureRef.current) {
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      const signatureRect = signatureRef.current.getBoundingClientRect();

      const x = signatureRect.left - containerRect.left;
      const y = signatureRect.top - containerRect.top;
      const width = signatureRect.width;
      const height = signatureRect.height;

      const req = {
        "signature_id": "d6535d55-81a1-4d54-8f81-18a220e49db2",
        "credential_id": "240205163135504x5TKhINaXb4g8Luk7P",
        "os": "Win10",
        "file_upload": pdfFile || undefined,
        "width": width,
        "height": height,
        "point_x": x,
        "point_y": y,
        "page_sign": currentPage,
        "computer_name": "Computer",
        "mac": "BC-E9-2F-A5-27-F0",
        "merchant_id": "VIETTEL",
        "password": "92046906",
        "user_Name": "tuanda@ptit.edu.vn"
      }
      
      await sign(req);
    }
  };

  const removeChuKy = () => {
    setSignaturePosition(null);
  }

  return (
    <div style={{ background: '#f4f4f4' }}>
      {isDragging && <div className="overlay"></div>}
      <div className="flex justify-between gap-[40px]">
        <div className="w-[400px] bg-white border-gray-500 p-4 rounded shadow-md">
          <h2>Mẫu chữ ký</h2>
          <Card style={{height: 'auto', marginBottom: '20px'}}>
            <Spin spinning={loading}>
              <Row gutter={[10, 10]}>
                {
                  dsKy?.map(item => <Col span={8}>
                    <div className="flex items-center">
                      <div
                        onDrag={e => handleDragStart(e, item)}
                        onDragEnd={() => setIsDragging(false)}
                        className="cursor-move rounded shadow-md"
                        draggable="true"
                      >
                        <img src={`http://10.99.3.126:6700/files/${item.file_path.replace('datas', '')}`} width={'100%'} alt="Signature" />
                      </div>
                    </div>
                  </Col>)
                }
              </Row>
            </Spin>
          </Card>

          <Button type="primary" onClick={layToaDo} icon={<AuditOutlined />}>
            KÝ SỐ
          </Button>
        </div>

        <div className="w-[calc(100%-400px)] margin-[auto] h-[100vh] overflow-auto py-4">
          <Pagination simple current={currentPage} total={numPages} className="mb-[20px]" onChange={(e) => setCurrentPage(Number(e))} defaultPageSize={1} />
          <div
            className={`relative border-2 border-dashed border-${isDragging ? 'blue-500' : 'grey'} p-2 container-drag w-[max-content] bg-${isDragging ? 'blue-50' : ''} mx-[auto]`}

          >
            {pdfFile && (
              <div ref={pdfContainerRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
              </div>

            )}

            {signaturePosition && <Draggable
              nodeRef={signatureRef as RefObject<HTMLElement>}
              onStop={() => setIsDragging(false)}
              onStart={() => setIsDragging(true)}
              bounds={"parent"}
              defaultPosition={{ x: signaturePosition.x, y: signaturePosition.y - 792 }}
            >
              
              <div id="chuKy"
                ref={signatureRef}
                className="absolute"
              >
                <div className="absolute close-button" onClick={removeChuKy}><CloseOutlined style={{fontSize: '8px'}}/></div> 
                <img className="cursor-move" src={`http://10.99.3.126:6700/files/${chuKyDrop?.file_path.replace('datas', '')}`} width={100} alt="Signature" />
              </div>
            </Draggable>}
          </div>
        </div>
      </div>
      <Modal title="Văn bản đã ký" visible={visibleForm} footer={false} onCancel={() => setVisibleForm(false)}> 
          {loadingKy && <div className="signing">
              <img src="/kyso/signing.gif" width={150}/>
              <strong>Đang chờ xác nhận...</strong>
          </div>}
      </Modal>
    </div>

  );
};

export default PDFSignatureApp;
