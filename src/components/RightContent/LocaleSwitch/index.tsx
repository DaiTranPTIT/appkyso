import { Menu } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import { getLocale, setLocale, useIntl } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from '../index.less';

const LocaleSwitch = () => {
	const intl = useIntl();
	// const allLocales = getAllLocales();

	const handleChange = (locale: string) => () => {
		if (getLocale() !== locale) setLocale(locale, true);
	};

	// const items: ItemType[] = allLocales.map((locale) => ({
	// 	key: locale,
	// 	label: locale,
	// 	onClick: handleChange(locale),
	// }));

	const items: ItemType[] = [
		{
			key: 'vi-VN',
			label: 'Tiếng Việt (vi-VN)',
			onClick: handleChange('vi-VN'),
			icon: <img src='/images/locales/vi-VN.svg' width={25} alt='vi' />,
		},
		{
			key: 'en-US',
			label: 'English (en-US)',
			onClick: handleChange('en-US'),
			icon: <img src='/images/locales/en-US.svg' width={25} alt='en' />,
		},
	];

	// Nếu ko cho đổi ngôn ngữ thì return null, đồng thời ở config sửa baseNavigator thành false
	return null;
	return (
		<HeaderDropdown overlay={<Menu items={items} className={styles.menu} />}>
			<span className={styles.action}>
				<img
					src={`/images/locales/${intl.formatMessage({ id: 'app.locale.image', defaultMessage: 'vi-VN.svg' })}`}
					alt='lang'
					width={25}
				/>
			</span>
		</HeaderDropdown>
	);
};

export default LocaleSwitch;
