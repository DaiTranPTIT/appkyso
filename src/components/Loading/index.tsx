import { DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import './style.less';
import { useIntl } from 'umi';

const LoadingPage = () => {
	const intl = useIntl();
	const onClearCache = () => {
		localStorage.clear();
		sessionStorage.clear();
		window.location.href = '/';
		window.location.reload();
	};

	return (
		<div className='loading-content'>
			<Spin spinning size='large' />

			<h2>{intl.formatMessage({ id: 'global.loading.thongbao1' })}</h2>
			<h3>{intl.formatMessage({ id: 'global.loading.thongbao2' })}</h3>

			<span className='loading-description'>{intl.formatMessage({ id: 'global.loading.thongbao3' })}</span>
			<div className='loading-actions'>
				{/* <Button icon={<HomeOutlined />} type='primary' onClick={() => (window.location.href = '/')}>
					Về trang chủ
				</Button> */}
				<Button type='link' danger icon={<DeleteOutlined />} onClick={onClearCache}>
					{intl.formatMessage({ id: 'global.loading.xoabonhodiem' })}
				</Button>
			</div>
		</div>
	);
};

export default LoadingPage;
