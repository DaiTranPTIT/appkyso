import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import './style.less';
import { Link, history, useIntl } from 'umi';

const HeaderContentPage = () => {
	const intl = useIntl();

	return (
		<div className='header-content'>
			<img src='/logo.png' alt='logo' onClick={() => history.push('/')} />
			<div>
				<div className='text-error'>{intl.formatMessage({ id: 'global.rightcontent.header.title' })}</div>
				<Link to='/'>{AppModules[currentRole].title?.toLocaleUpperCase()}</Link>
			</div>
		</div>
	);
};

export default HeaderContentPage;
