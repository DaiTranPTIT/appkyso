import { EDinhDangFile } from '@/services/base/constant';
import type { IFileInfo } from '@/services/base/typing';
import { getFileInfo } from '@/services/uploadFile';
import { ip3 } from '@/utils/ip';
import { getFileType, getNameFile } from '@/utils/utils';
import { CopyOutlined, DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';
import { message, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import ButtonExtend from '../Table/ButtonExtend';
import type { TPreviewFileProps } from './typing';

const PreviewFile: React.FC<TPreviewFileProps> = (props) => {
	const intl = useIntl();
	const { file, width = '100%', height = '600px', children, ip = ip3, isFileId } = props;
	const [fileType, setFileType] = useState<EDinhDangFile>(EDinhDangFile.UNKNOWN);
	const [fileUrl, setFileUrl] = useState<string>('');
	const [iframeSrc, setIframeSrc] = useState<string>('');

	const getFileExtension = (url: string) => {
		const arr = url.split('.');
		return arr.length > 1 ? arr.at(-1) : '';
	};

	const getFileTypeFromUrl = async (url: string) => {
		const idFile = isFileId ? url : url.split('/')[url.length - 2];
		let mime: EDinhDangFile = EDinhDangFile.UNKNOWN;

		try {
			// Nếu có thông tin id file thì get thông tin chi tiết
			if (idFile) {
				const result = await getFileInfo(idFile, ip);
				const fileInfo: IFileInfo = result?.data?.data;
				const fileurl1 = fileInfo?.url ?? (!isFileId ? url : '');

				// Mapping { mimetype : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"} sang EDinhDangFile
				mime =
					getFileType(fileInfo?.mimetype ? fileInfo.mimetype : getFileExtension(fileurl1) ?? '') ||
					EDinhDangFile.UNKNOWN;
				setFileUrl(fileurl1);
			} else {
				mime = getFileType(getFileExtension(url) ?? '') || EDinhDangFile.UNKNOWN;
				setFileUrl(url);
			}
		} catch (error) {
			console.error(error);
		}

		return mime;
	};

	const getIframeSrc = (type: EDinhDangFile) => {
		if (!fileUrl) return '';
		const officeFileType = [EDinhDangFile.WORD, EDinhDangFile.EXCEL, EDinhDangFile.POWERPOINT];
		if (type && officeFileType.includes(type)) {
			return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
		} else {
			return fileUrl;
		}
	};

	useEffect(() => {
		const fetchFileType = async () => {
			try {
				const res = await getFileTypeFromUrl(file);
				const type = getFileType(res) as EDinhDangFile;
				setFileType(type);

				const val = getIframeSrc(type);
				setIframeSrc(val);
			} catch (error) {
				console.error(error);
			}
		};

		fetchFileType();
	}, [file]);

	const handleDownload = async () => {
		if (fileUrl) {
			try {
				const response = await fetch(fileUrl);
				const blob = await response.blob();
				fileDownload(blob, getNameFile(fileUrl));
			} catch (error) {
				console.error('Error downloading file:', error);
			}
		}
	};

	const handleCopy = () => {
		if (file) {
			navigator.clipboard
				.writeText(file)
				.then(() => {
					message.success(intl.formatMessage({ id: 'global.previewfile.message.saochep' }));
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	return (
		<>
			<Space wrap align='center' style={{ justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
				<b>{getNameFile(fileUrl ?? '--')}</b>

				<Space wrap>
					<ButtonExtend
						type='link'
						tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
						icon={<DownloadOutlined />}
						onClick={handleDownload}
					/>
					<ButtonExtend
						type='link'
						tooltip={intl.formatMessage({ id: 'global.previewfile.button.saochep' })}
						icon={<CopyOutlined />}
						onClick={handleCopy}
					/>
					<ButtonExtend
						type='link'
						tooltip={intl.formatMessage({ id: 'global.previewfile.button.morong' })}
						icon={<FullscreenOutlined />}
						onClick={() => window.open(iframeSrc, '_blank')}
					/>
					{children}
				</Space>
			</Space>

			{fileType !== EDinhDangFile.UNKNOWN && !!iframeSrc ? (
				<iframe src={iframeSrc} width={width} height={height} />
			) : (
				<div
					style={{
						padding: '20px',
						textAlign: 'center',
						background: '#f8d7da',
						color: '#721c24',
						border: '1px solid #f5c6cb',
						borderRadius: '5px',
					}}
				>
					<p>
						<strong>{intl.formatMessage({ id: 'global.previewfile.thongbao' })}</strong>
						<br />

						{!!fileUrl && (
							<ButtonExtend
								notHideText
								type='link'
								tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
								icon={<DownloadOutlined />}
								onClick={handleDownload}
							>
								{intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
							</ButtonExtend>
						)}
					</p>
				</div>
			)}
		</>
	);
};

export default PreviewFile;
