import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { type TooltipProps } from 'antd/lib/tooltip';
import { useIntl } from 'umi';

interface EllipsisProps {
	rows?: number;
	expandable?: boolean;
	suffix?: string;
	symbol?: React.ReactNode;
	onEllipsis?: (ellipsis: boolean) => void;
	tooltip?: React.ReactNode | TooltipProps;
}

interface IProps {
	children: any;
	style?: React.CSSProperties;
	ellipsis?: EllipsisProps;
}

const ExpandText = (props: IProps) => {
	const intl = useIntl();
	const [expand, setExpand] = useState<boolean>(false);
	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		setExpand(false);
	}, [props.children]);

	const typoExpand = () => {
		setExpand(true);
		setCounter(!expand ? counter + 0 : counter + 1);
	};
	const typoClose = () => {
		setExpand(false);
		setCounter(!expand ? counter + 0 : counter + 1);
	};

	return (
		<div key={counter}>
			<Typography.Paragraph
				style={{ ...props.style, overflowWrap: props.style?.overflowWrap ?? 'anywhere' }}
				ellipsis={{
					rows: 3,
					symbol: intl.formatMessage({ id: 'global.expandText.xemtiep' }),
					expandable: true,
					...props.ellipsis,
					onExpand: typoExpand,
				}}
			>
				{props.children}
			</Typography.Paragraph>
			{expand && <a onClick={typoClose}>{intl.formatMessage({ id: 'global.expandText.anbot' })}</a>}
		</div>
	);
};
export default ExpandText;
