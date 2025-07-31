import { type IColumn } from '@/components/Table/typing';
import { getLogKyApi } from '@/services/LogKy/api';
import { EFunctionKy, ETypeKy } from '@/services/LogKy/constant';
import { FoundItem } from '@/services/LogKy/typing';
import { Card, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [dsLog, setDsLog] = useState<FoundItem[]>([]);
  const { initialState } = useModel('@@initialState');
  const [tableParams, setTableParams] = useState<any>({
    current: 0,
    pageSize: 0,
    total: 0                                             
  });
  const fullName = initialState?.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || '');

  const getLogKy = async (paging?: {page: number, page_size: number}) => {
    try {
        const res = await getLogKyApi(paging);
        if(res) {
            setDsLog(res.data.founds);
            setTableParams({
                current: res.data.search_options.page,
                pageSize: res.data.search_options.page_size,
                total: res.data.search_options.total_count,
                pageSizeOptions: ["5", "10", "20", "50"],
                onChange: handlePageChange
            });
        }
    } catch(err) {
        console.log(err);
    }
  }

  const handlePageChange = (evt: any) => {
    getLogKy({page: evt, page_size: tableParams.page_size});
  }

  useEffect(() => {
    getLogKy();
  }, []);

  const columns: IColumn<FoundItem>[] = [
    {
        title: 'TT',
        align: 'center',
        width: 50,
        render: (val, rec, index) => (tableParams.current-1)*tableParams.pageSize + index + 1
    },
    {
      title: 'Người cần ký',
      align: 'left',
      width: 80,
      render: () => fullName,
    },
    {
      title: 'Hình thức ký',
      align: 'center',
      dataIndex: 'type',
      width: 80,
      render: (val: keyof typeof ETypeKy) => ETypeKy[val],
      filters: Object.entries(ETypeKy).map(([key, label]) => ({
        text: label,
        value: key,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Phương thức ký',
        align: 'center',
        dataIndex: 'function',
        width: 80,
        filters: Object.entries(EFunctionKy).map(([key, label]) => ({
        text: label,
        value: key,
      })),
      onFilter: (value, record) => record.function === value,
      render: (val: keyof typeof EFunctionKy) => EFunctionKy[val],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'signed',
      align: 'center',
      width: 80,
      sortable: true,
      filters: [
        { text: 'Đã ký', value: true },
        { text: 'Chưa ký', value: false },
      ],
      onFilter: (value, record) => record.signed === value,
      render: (val, rec) => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Tag color={val? 'green': 'orange'}>{val? 'Đã ký': 'Chưa ký'}</Tag>
        {val && <p style={{marginTop: '8px'}}>Thời gian ký: {moment(rec.signed_time).format('HH:mm DD/MM/YYYY')}</p>}
        </div>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'updated_at',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
    },
  ];

  return (
    <>
        <h1>Lịch sử ký số</h1>
        <Card>
            <Table dataSource={dsLog} columns={columns} pagination={tableParams}/>
        </Card>
    </>
  );
};
