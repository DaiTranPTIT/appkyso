import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Modal, type ModalProps } from 'antd';
import React, { useState } from 'react';
import './style.less';

const ModalExpandable = (
	props: {
		children?: ((isExpand: boolean) => React.ReactNode) | React.ReactNode;
		/** Có hiển thị full screen ko? Mặc định: Không */
		fullScreen?: boolean;
	} & ModalProps,
) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { children, fullScreen, ...otherProps } = props;

	return (
		<Modal className={isExpanded || fullScreen ? 'modal-full' : ''} closable={false} {...otherProps}>
			{typeof children === 'function' ? children(isExpanded) : children}

			<div className='modal-buttons'>
				{!fullScreen && (
					<button className='button' onClick={() => setIsExpanded((expand) => !expand)}>
						{isExpanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
					</button>
				)}

				<button className='button' onClick={otherProps.onCancel}>
					<CloseOutlined />
				</button>
			</div>
		</Modal>
	);
};

export default ModalExpandable;
