import type { UploadProps } from 'antd';
import type { UploadFile as UpFile } from 'antd/es/upload/interface';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import type { TPreviewFileProps } from '../PreviewFile/typing';

export type TUploadProps = {
	fileList?: any;
	value?: string | string[] | null | { fileList: UpFile[]; [key: string]: any };
	onChange?: (val: { fileList: any[] | null }) => void;
	maxCount?: number;
	/** Có kéo thả Dragger không? */
	drag?: boolean;
	accept?: string;
	buttonDescription?: string;
	buttonSize?: SizeType;
	otherProps?: UploadProps;

	/** Upload ảnh đại diện 3:4? */
	isAvatar?: boolean;
	/** Ảnh khung 1:1? */
	isAvatarSmall?: boolean;
	/** Ảnh nằm ngang 4:3? */
	isPortraitAvatar?: boolean;

	/** Có thu nhỏ ảnh ko?
	 * @default false
	 */
	resize?: boolean | TResizeProps;

	maxFileSize?: number;

	/** Gợi ý thêm lúc nhập liệu, thêm vào sau input, bên dưới số file tối đa */
	extra?: string;

	/** Có thể dùng `disabled` này hoặc trong `otherProps` */
	disabled?: boolean;

	/** Có cho xem file khi upload không */
	hasPreviewFile?: boolean;

	previewFileProps?: Pick<TPreviewFileProps, 'isFileId' | 'ip'>;
};

export type TResizeProps = {
	/** Chiều rộng tối đa của hình ảnh sau khi resize */
	maxWidth?: number;
	/** Chiều cao tối đa của hình ảnh sau khi resize */
	maxHeight?: number;
	/** Định dạng của hình ảnh mới */
	compressFormat?: 'jpeg' | 'png' | 'webp';
	/** Chất lượng của hình ảnh mới */
	quality?: number;
	/** Độ xoay theo chiều kim đồng hồ áp dụng cho hình ảnh được tải lên */
	rotation?: number;
	/** Loại đầu ra của hình ảnh mới */
	outputType?: 'base64' | 'blob' | 'file';
	/** Chiều rộng tối thiểu của hình ảnh mới */
	minWidth?: number;
	/** Chiều cao tối thiểu của hình ảnh mới */
	minHeight?: number;
};

type TFileProps = UpFile & { resized?: boolean; remote?: boolean };
