import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';

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
			locale: { skip: <strong aria-label='skip'>Đóng</strong> },
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
				buttonNext: { backgroundColor: '#1976d2', color: '#fff', borderRadius: '8px', fontWeight: 'bold' },
				buttonBack: { color: '#d32f2f' },
				buttonClose: { color: '#ff0000' },
			}}
		/>
	);
};

export default JoyrideBase;
