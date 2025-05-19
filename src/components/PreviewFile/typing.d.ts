export type TPreviewFileProps = {
	/** Đường dẫn file (hoặc idFile) */
	file: string | string[];
	width?: string;
	height?: string;
	children?: React.ReactElement;
	ip?: string;
	tenFile?: string | string[];

	/** File truyền vào là id File */
	isFileId?: boolean;

	style?: React.CSSProperties;
};
