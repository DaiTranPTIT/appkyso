import { blobToBase64, getNameFile } from '@/utils/utils';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { useIntl } from 'umi';
import PreviewFile from '../PreviewFile';
import ModalExpandable from '../Table/ModalExpandable';
import './UploadAvatar.less';
import type { TFileProps, TResizeProps, TUploadProps } from './typing';

const UploadFile: React.FC<TUploadProps> = ({
	value,
	onChange,
	otherProps,
	drag,
	buttonSize,
	buttonDescription,
	accept,
	isAvatar,
	isAvatarSmall,
	maxFileSize = 5,
	maxCount = 1,
	disabled,
	resize,
	fileList: fileListProp,
	extra,
	isPortraitAvatar,
	hasPreviewFile = true,
	...props
}) => {
	const intl = useIntl();
	const isDisabled = disabled || otherProps?.disabled || false;
	const [fileList, setFileList] = useState<any[]>();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const resizeProps: TResizeProps | undefined = typeof resize === 'boolean' ? {} : resize;
	const showImage = isAvatar || isAvatarSmall || isPortraitAvatar;

	useEffect(() => {
		let files: any[] = [];
		// Single URL
		if (typeof value === 'string') {
			files = [{ url: value, remote: true, name: props.previewFileProps?.isFileId ? 'Tập tin' : getNameFile(value) }];
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Array of URLs
		else if (Array.isArray(value)) {
			files = value.map((url, ind) => ({
				url,
				remote: true,
				name: props.previewFileProps?.isFileId ? `Tập tin ${ind + 1}` : getNameFile(url),
			}));
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Object of antd file upload
		else {
			files = fileListProp || (value && value.fileList) || [];
			setFileList(files);
		}
	}, [value, fileListProp]);

	/** Resize Hình ảnh */
	const resizeImages = (files: TFileProps[]): TFileProps[] => {
		let res = files;
		try {
			res = files?.map((file) => {
				const type = file.type?.split('/'); // image/jpeg
				if (type?.[0] === 'image' && !file.resized) {
					file.resized = true;
					Resizer.imageFileResizer(
						file.originFileObj as any,
						resizeProps?.maxWidth ?? 1024,
						resizeProps?.maxHeight ?? 1024,
						resizeProps?.compressFormat ?? type?.[1] ?? 'webp',
						resizeProps?.quality ?? 90,
						resizeProps?.rotation ?? 0,
						(blob: any) => {
							// temp = [{ url: URL.createObjectURL(blob), remote: true, name: getNameFile(URL.createObjectURL(blob)) }];
							// console.log('🚀 ~ useEffect ~ temp:', temp);
							file.originFileObj = blob;
						},
						resizeProps?.outputType ?? 'file',
						resizeProps?.minWidth,
						resizeProps?.minHeight,
					);
				}
				return file;
			});
		} catch (err) {
			console.log(err);
		}
		return res;
	};

	const handleChange = (val: any) => {
		let files = val.fileList as TFileProps[];
		const findLargeFile = files?.some((file) => file.size && file.size / 1024 / 1024 > maxFileSize);
		if (findLargeFile) {
			message.error(intl.formatMessage({ id: 'global.uploadfile.error.mb' }, { maxFileSize: maxFileSize }));
			return;
		}

		const findWrongTypeFile = files?.some((file) => {
			const arrFileName = file.name.split('.');
			return file?.remote !== true && !otherProps?.accept?.includes(arrFileName?.[arrFileName.length - 1]);
		});
		if (findWrongTypeFile && otherProps?.accept) {
			message.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));
			return;
		}

		if (files.length > maxCount) files.splice(0, files.length - maxCount);
		if (!!resize) files = resizeImages(files);

		setFileList(files);
		if (onChange) onChange({ fileList: files });
	};

	/** Xem trước ảnh */
	const handlePreviewImage = async (file: TFileProps) => {
		// Nếu file mới up lên (chưa có url và preview) thì thêm preview vào file
		if (!file.url && !file.preview) file.preview = await blobToBase64(file.originFileObj as RcFile);

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	/** Xem trước file */
	const handlePreviewFile = async (file: TFileProps) => {
		if (file.url) {
			setPreviewImage(file.url ?? '');
			setPreviewOpen(true);
		}
	};

	const Extra = () =>
		isDisabled ? null : (
			<small style={{ color: '#999' }}>
				<i>{intl.formatMessage({ id: 'global.uploadfile.toida' }, { maxCount: maxCount, maxFileSize: maxFileSize })}</i>
				{extra && (
					<div>
						<i>{extra}</i>
					</div>
				)}
			</small>
		);

	// DRAGGER
	if (drag)
		return (
			<Upload.Dragger
				disabled={isDisabled}
				customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={maxCount > 1}
				accept={accept}
				{...otherProps}
			>
				{!isDisabled ? (
					<>
						<p className='ant-upload-drag-icon'>
							<UploadOutlined />
						</p>
						<p className='ant-upload-text'>{intl.formatMessage({ id: 'global.uploadfile.text' })}</p>
						<p className='ant-upload-hint'>{buttonDescription}</p>
						<Extra />
					</>
				) : null}
			</Upload.Dragger>
		);

	if (showImage)
		return (
			<>
				<Upload
					disabled={isDisabled}
					customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
					listType='picture-card'
					className={`avatar-uploader ${
						isAvatarSmall ? 'avatar-small' : isPortraitAvatar ? 'avatar-portrait' : undefined
					}`}
					fileList={fileList}
					onChange={handleChange}
					style={{ width: '100%' }}
					multiple={false}
					accept='image/*'
					onPreview={handlePreviewImage}
					{...otherProps}
				>
					{!isDisabled && !fileList?.length ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<PlusOutlined />
							<div className='ant-upload-text'>
								{buttonDescription || intl.formatMessage({ id: 'global.uploadfile.text1' })}
							</div>
						</div>
					) : null}
				</Upload>
				<Extra />

				<Image
					style={{ display: 'none' }}
					preview={{
						visible: previewOpen,
						src: previewImage,
						onVisibleChange: (val) => setPreviewOpen(val),
					}}
				/>
			</>
		);

	// UPLOAD BUTTON
	return (
		<>
			<Upload
				disabled={isDisabled}
				customRequest={({ onSuccess }) => {
					setTimeout(() => onSuccess && onSuccess('ok'), 0);
				}}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={maxCount > 1}
				accept={accept}
				onPreview={hasPreviewFile ? handlePreviewFile : undefined}
				{...otherProps}
			>
				{!isDisabled ? (
					<Button size={buttonSize || 'small'} icon={<UploadOutlined />}>
						{buttonDescription || intl.formatMessage({ id: 'global.uploadfile.button.chontep' }, { maxFileSize })}
					</Button>
				) : null}
			</Upload>
			<Extra />

			{hasPreviewFile && (
				<ModalExpandable
					title='Xem trước tập tin'
					width={1200}
					visible={previewOpen}
					footer={null}
					onCancel={() => setPreviewOpen(false)}
				>
					<PreviewFile file={previewImage} {...props.previewFileProps} />

					<div className='form-footer'>
						<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</ModalExpandable>
			)}
		</>
	);
};

export default UploadFile;
