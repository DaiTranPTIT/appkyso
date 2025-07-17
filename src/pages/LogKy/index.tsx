import { type IColumn } from '@/components/Table/typing';
import { getLogKyApi } from '@/services/LogKy/api';
import { FoundItem } from '@/services/LogKy/typing';
import { Card, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default () => {
  const [dsLog, setDsLog] = useState<FoundItem[]>([]);
  const [tableParams, setTableParams] = useState<any>({
    current: 0,
    pageSize: 0,
    total: 0                                             
  });

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
        width: 100,
        render: (val, rec, index) => (tableParams.current-1)*tableParams.pageSize + index + 1
    },
    {
      title: 'Session id',
      dataIndex: 'session_id',
      width: 80
    },
    {
      title: 'File link',
      dataIndex: 'file_link',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
        title: 'File link',
        dataIndex: 'file_link',
        width: 150,
        filterType: 'string',
        sortable: true,
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
