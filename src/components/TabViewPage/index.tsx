import useCheckAccess from '@/hooks/useCheckAccess';
import NotAccessible from '@/pages/exception/403';
import { Affix, Card, Steps, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.less';
import type { TabViewPageProps } from './typing';

const PermissionWrapper = (props: { content: JSX.Element; accessCode?: string }) => {
	const { accessCode, content } = props;
	const allowAccessCode = useCheckAccess(accessCode!);
	const allow = accessCode ? allowAccessCode : true;

	return allow ? <div style={{ marginTop: 16 }}>{content}</div> : <NotAccessible />;
};

export const getTitle = (title?: string, menuTitle?: string) => [title, menuTitle].filter(Boolean).join(' - ');

export const TabViewPage = (props: {
	menu: TabViewPageProps[];
	cardTitle?: string;
	hideCard?: boolean;
	onChange?: (key: string) => void;
	children?: React.ReactNode;
	type?: 'tab' | 'step';
}) => {
	const { menu = [], hideCard, children, onChange, cardTitle, type = 'tab' } = props;
	const activeMenu = menu?.filter((i) => !i.hide);
	const paths = activeMenu?.map((item) => item.menuKey);
	const hash = window.location.hash?.replace('#', '') || paths[0];
	const [tabActive, setTabActive] = useState<string | undefined>(paths[0]);
	const [currentTitle, setCurrentTitle] = useState(getTitle(cardTitle, activeMenu[0]?.title));

	useEffect(() => {
		if (hash && paths.includes(hash)) setTabActive(hash);
		else setTabActive(paths[0]);
	}, [hash, menu]);

	const onChangeTab = (tab: string) => {
		if (onChange) onChange(tab);
		setCurrentTitle(getTitle(cardTitle, activeMenu.find((item) => item.menuKey === tab)?.title));
		window.location.hash = tab === paths[0] ? '' : tab;
	};

	const mainContent = () => (
		<>
			{children}

			{/* Chiều cao của header => Có thể tùy chỉnh tùy tenant */}
			<Affix offsetTop={60}>
				{type === 'step' ? (
					<Steps
						type='navigation'
						current={paths.includes(hash) ? paths.indexOf(hash) : 0}
						onChange={(step) => onChangeTab(paths[step])}
						style={{ marginBottom: 18, background: 'white' }}
					>
						{activeMenu.map((step) => (
							<Steps.Step key={step.menuKey} title={step.title} />
						))}
					</Steps>
				) : (
					<Tabs activeKey={tabActive} onChange={(key) => onChangeTab(key)} className='tab-view-menu' type='card'>
						{activeMenu.map((item) => (
							<Tabs.TabPane
								tab={
									<>
										{item.icon}
										{item.title}
									</>
								}
								key={item.menuKey}
							/>
						))}
					</Tabs>
				)}
			</Affix>

			{activeMenu.map((item) => {
				if (tabActive === item.menuKey) {
					return <PermissionWrapper key={item.menuKey} content={item.content} accessCode={item.accessCode} />;
				}
				return null;
			})}
		</>
	);

	if (hideCard) return mainContent();
	return <Card title={currentTitle}>{mainContent()}</Card>;
};
