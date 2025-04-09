export type TPreviewFileProps = {
	/** Đường dẫn file (hoặc idFile) */
	file: string;
	width?: string;
	height?: string;
	children?: React.ReactElement;
	ip?: string;

	/** File truyền vào là id File */
	isFileId?: boolean;
};
