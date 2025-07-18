import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Card, Col, Form, Input, Modal, notification, Pagination, Row, Spin, Tag } from "antd";
import { getFileFromServer } from "@/utils/function";
import Draggable from "react-draggable";
import { FileInfo } from "@/services/GiaoDienKy/typing";
import { apiKy, getDsKyApi } from "@/services/GiaoDienKy/api";
import { CloseOutlined, ContactsFilled } from "@ant-design/icons";
import './style.less';
import { ipServiceKy } from "@/utils/ip";
import { useParams } from "react-router";
import { useForm } from "antd/lib/form/Form";
import rules from "@/utils/rules";
import { useAuth } from "react-oidc-context";
import LoadingComponent from "@/components/LoadingComponent";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
type ParamsType = {
  id: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default () => {
  const { id } = useParams<ParamsType>();
  const auth = useAuth();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [form] = useForm();
  const [numPages, setNumPages] = useState<number>(0);
  const [dsKy, setDsKy] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [signatureAreas, setSignatureAreas] = useState<any>();
  const [signatureArea, setSignatureArea] = useState<any>();

  const [chuKyDrag, setChuKyDrag] = useState<FileInfo>();
  const [chuKyDrop, setChuKyDrop] = useState<
  {
    chuKy: FileInfo,
    page: number
  }>();

  const [loading, setLoading] = useState(false);
  const [loadingKy, setLoadingKy] = useState<boolean>(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null);
  const [pointInSign, setPointInSign] = useState<{ x: number, y: number, width: number, height: number }>(
    {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  );
  const [initialLocation, setInitialLocation] = useState<{
    x: number,
    y: number,
    page: number,
    width: number,
    height: number
  }>();


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

  useEffect(() => {
    if(!signatureAreas) return;
    setSignatureArea(signatureAreas[signatureAreas.length - 1]);
  }, [signatureAreas]);

  useEffect(() => {
    if(signatureArea) {
      setInitialLocation({
        x: Number(signatureArea.signature_area.x),
        y: Number(signatureArea.signature_area.y),
        page: Number(signatureArea.page),
        width: Number(signatureArea.signature_area.width),
        height: Number(signatureArea.signature_area.height)
      });
    }
  }, [signatureArea]);

  useEffect(() => {
    if (dsKy[0] && initialLocation && pdfLoaded) {
      setTimeout(() => {
        const containerRect = pdfContainerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        setSignaturePosition({ x: containerWidth * initialLocation.x / 100, y: (containerHeight - initialLocation.height*containerHeight/100) - (containerHeight * initialLocation.y / 100) });
        setChuKyDrop({chuKy: dsKy[0], page: initialLocation.page});
        setChuKyDrag(dsKy[0]);
        setCurrentPage(initialLocation.page || 1);
      }, 100);
    }
  }, [dsKy, initialLocation, pdfLoaded]);

  const getSignInfo = async () => {
    try {
      const file = await getFileFromServer(`${ipServiceKy}/sign-info/file_content/${id}`, auth.user?.access_token);
      if (!file) return;
      setPdfFile(file.fileContent);
      setSignatureAreas(file.signatureAreas);
      setPdfLoaded(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDragStart = (e: React.DragEvent, chuKy: FileInfo) => {
    if (!dragStartPosition.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      dragStartPosition.current = { x: offsetX, y: offsetY };
      setPointInSign({ x: offsetX, y: offsetY, width: rect.width, height: rect.height })
    }
    setChuKyDrag(chuKy);
    setIsDragging(true);
  };

  const sign = async (req: any) => {
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
    formData.append("phone", req.phone);
    setLoadingKy(true);
    try {
      setLoadingKy(true);
      const res = await apiKy(formData);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
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
    if (pdfContainerRef.current && chuKyDrag) {
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left - pointInSign.x + 10;
      const y = e.clientY - containerRect.top - pointInSign.y;

      // Kiểm tra xem có thả vào vùng PDF không
      if (x >= 0 && x <= containerRect.width && y >= 0 && y <= containerRect.height) {
        setSignaturePosition({ x, y });
        setChuKyDrop({chuKy: chuKyDrag, page: currentPage});
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const showModalUsernamePassword = async () => {
    Modal.confirm({
      title: 'Nhập số điện thoại',
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
          <Form.Item name="phone" rules={[...rules.required, ...rules.soDienThoai]} label="Nhập số điện thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Form>
      )
    });
  }

  const layToaDo = async (acc: {
    phone: string,
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
        signature_id: chuKyDrop?.chuKy?.id || '',
        credential_id: chuKyDrop?.chuKy?.credential_id || '',
        os: window.navigator.userAgent,
        width: width,
        height: height,
        point_x: point_x,
        point_y: point_y,
        page_sign: currentPage,
        computer_name: "Computer",
        mac: "00-00-00-00-00-00",
        merchant_id: "VIETTEL",
        phone: acc.phone
      }

      try {
        const res = await sign(req);
        if (!res) return;
        notification.success({
          message: 'Ký số thành công',
          description: 'Đang chuyển hướng...',
          duration: 5,
          onClose() {
            window.close();
          },
        });
        getSignInfo();
        removeChuKy();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeChuKy = () => {
    setSignaturePosition(null);
    setChuKyDrop(undefined);
  }

  return (
    <>
      {!pdfLoaded ? <LoadingComponent />: <div style={{ background: '#f4f4f4' }}>
        {isDragging && <div className="overlay"></div>}
        <div className="flex justify-between">
          <div className="w-[400px] border-gray-500 px-3 py-4 bg-white">
            <h2 className="mb-4"><strong>Mẫu chữ ký</strong></h2>
            <Card style={{ height: 'auto', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              <Spin spinning={loading}>
                <Row gutter={[10, 10]}>
                  {
                    dsKy?.map(item => 
                    <Col span={24} onClick={() => {
                      setChuKyDrag(item);
                      setChuKyDrop({chuKy: item, page: currentPage});
                    }}
                    className={`bg-white border-gray-500 p-2 rounded shadow-md chu-ky ${item === chuKyDrop?.chuKy && 'active'}`}>
                      <div className="flex items-center gap-[10px]">
                        <div
                          onDrag={e => handleDragStart(e, item)}
                          onDragEnd={e => {
                            setIsDragging(false);
                            dragStartPosition.current = null;
                          }}
                          draggable="true"
                        >
                          <img src={`${ipServiceKy}${item.file_path}`} style={{height: '40px', objectFit: 'contain', background: 'white'}} alt="Signature" />
                        </div>
                        <strong>{item.name}</strong>
                      </div>
                    </Col>)
                  }
                </Row>
              </Spin>
            </Card>

            {signatureAreas?.length > 0 && <div className="flex items-center">
              <strong>Gợi ý trang ký khả dụng </strong>
              <ul className="signature-areas">
                {
                  signatureAreas?.map((item: any) => {
                    return <li>
                      <Tag style={{cursor: 'pointer'}} onClick={() => {
                        setSignatureArea(item);
                      }} color={item === signatureArea ? 'red': undefined}>Trang {item.page}</Tag>
                    </li>
                  })
                }
              </ul>
            </div>}
            
          </div>

          <div className="w-[calc(100%-400px)] margin-[auto] h-[100vh] overflow-auto">
            <div className="flex justify-between items-center topbar-control px-4 py-2">
              <Pagination size="small" simple current={currentPage} total={numPages} onChange={(e) => setCurrentPage(Number(e))} defaultPageSize={1} />
              <Button disabled={!chuKyDrop} type="primary" onClick={showModalUsernamePassword} icon={<ContactsFilled />}>Ký số</Button>
            </div>
            <div className="py-4">
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
                    className={`absolute ${chuKyDrop?.page === currentPage? 'show' : 'hidden'}`}
                  >
                    <div className="absolute close-button" style={{zIndex: 1}} onClick={removeChuKy}><CloseOutlined style={{ fontSize: '8px' }} /></div>
                    <ResizableBox
                      width={initialLocation && pdfContainerRef.current?.getBoundingClientRect() ? initialLocation?.width * (pdfContainerRef.current?.getBoundingClientRect().width) / 100 : 100}
                      height={initialLocation && pdfContainerRef.current?.getBoundingClientRect() ? initialLocation?.height * (pdfContainerRef.current?.getBoundingClientRect().height) / 100 : 100}
                      minConstraints={[40, 40]}
                      maxConstraints={[200, 200]}
                      resizeHandles={['se', 'sw', 'ne', 'nw']}
                      lockAspectRatio={true}
                      onResizeStop={(e, data) => {
                        // Cập nhật lại width/height vào state
                        setPointInSign(prev => ({
                          ...prev,
                          width: data.size.width,
                          height: data.size.height
                        }));
                      }}
                    >
                      <img className="cursor-move" style={{width: '100%', height: '100%', objectFit: 'fill'}} src={`${ipServiceKy}${chuKyDrop?.chuKy?.file_path}`} alt="Signature" />
                    </ResizableBox>
                    
                  </div>
                </Draggable>}
              </div> || <Spin className="flex items-center w-[100%]" />}
            </div>
          </div>
        </div>
        <Modal title="Xác nhận ký" visible={loadingKy} footer={false} onCancel={() => setLoadingKy(false)}>
          {loadingKy && <div className="signing">
            <img src="/kyso/signing.gif" width={150} />
            <strong>Đang chờ xác nhận...</strong>
          </div>}
        </Modal>
      </div>}
    </>
  );
};