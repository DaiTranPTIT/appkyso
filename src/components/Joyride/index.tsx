import { primaryColor } from '@/services/base/constant';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';

const getCommonButtonStyle = (primary?: boolean) => {
	return {
		backgroundColor: primary ? primaryColor : '#fff',
		color: primary ? '#fff' : '#000',
		border: '1px solid #d9d9d9',
		padding: '8px 15px',
		fontSize: '14px',
		cursor: 'pointer',
		borderRadius: '4px',
	};
};

interface JoyrideBaseProps {
	/** State để chuyển hướng bản hướng dẫn */
	run: boolean;
	setRun: (val: boolean) => void;

	/** Các bước của bản hướng dẫn, Lưu ý target là phần tử hướng dẫn đi đến có lấy từ className của phần tử*/
	customSteps: Step[];

	/** Tiêu đề bản hướng dẫn */
	title?: string;
}

const JoyrideBase = ({ run, setRun, customSteps = [], title }: JoyrideBaseProps) => {
	const steps = [
		{
			content: <h2>{title ?? 'Bắt đầu hướng dẫn!'}</h2>,
			locale: { skip: 'Đóng' },
			placement: 'center' as any,
			target: 'body',
			styles: {
				options: {
					width: 400,
				},
			},
		},
		...customSteps,
	];

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			setRun(false);
		}
	};

	return (
		<Joyride
			callback={handleJoyrideCallback}
			continuous
			run={run}
			scrollOffset={64}
			scrollToFirstStep
			showProgress
			showSkipButton
			steps={steps}
			locale={{
				back: 'Quay lại',
				close: 'Đóng',
				last: 'Hoàn thành',
				next: 'Tiếp',
				skip: 'Bỏ qua',
				nextLabelWithProgress: 'Bước ({step}/{steps})',
			}}
			styles={{
				options: { zIndex: 10000 },
				buttonNext: getCommonButtonStyle(true),
				buttonBack: getCommonButtonStyle(),
				buttonSkip: getCommonButtonStyle(),
			}}
		/>
	);
};

export default JoyrideBase;
