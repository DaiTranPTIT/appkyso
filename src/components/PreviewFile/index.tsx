import { EDinhDangFile } from '@/services/base/constant';
import type { IFile } from '@/services/base/typing';
import { getFileInfo } from '@/services/uploadFile';
import { ip3 } from '@/utils/ip';
import { getFileType, getNameFile } from '@/utils/utils';
import { CopyOutlined, DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';
import { message, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import ButtonExtend from '../Table/ButtonExtend';
import { useIntl } from 'umi';

const PreviewFile = (props: {
	file: string;
	width?: string;
	height?: string;
	children?: React.ReactElement;
	ip?: string;
}) => {
	const intl = useIntl();
	const { file, width = '100%', height = '600px', children, ip = ip3 } = props;
	const [fileType, setFileType] = useState<EDinhDangFile>(EDinhDangFile.UNKNOWN);
	const [iframeSrc, setIframeSrc] = useState<string>('');

	const getFileExtension = (url: string) => {
		const arr = url.split('.');
		return arr.length > 1 ? arr.at(-1) : '';
	};

	const getFileTypeFromUrl = async (url: string) => {
		const idFile = url.split('/')[url.length - 2];
		let mime = '';

		try {
			if (idFile) {
				const result = await getFileInfo(idFile, ip);
				const fileInfo: IFile = result?.data;
				return fileInfo?.file?.mimetype || getFileExtension(url) || EDinhDangFile.UNKNOWN;
			} else {
				mime = getFileExtension(url) || EDinhDangFile.UNKNOWN;
			}
		} catch (error) {
			console.error(error);
			return EDinhDangFile.UNKNOWN;
		}

		return mime;
	};

	const getIframeSrc = (type: EDinhDangFile) => {
		if (!file) return '';
		const officeFileType = [EDinhDangFile.WORD, EDinhDangFile.EXCEL, EDinhDangFile.POWERPOINT];
		if (type && officeFileType.includes(type)) {
			return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file)}`;
		} else {
			return file;
		}
	};

	useEffect(() => {
		const fetchFileType = async () => {
			try {
				const res = await getFileTypeFromUrl(file);
				setFileType(getFileType(res) as EDinhDangFile);

				if (res) {
					const val = getIframeSrc(getFileType(res) as EDinhDangFile);
					setIframeSrc(val);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchFileType();
	}, [file]);

	const handleDownload = async () => {
		if (file) {
			try {
				const response = await fetch(file);
				const blob = await response.blob();
				fileDownload(blob, getNameFile(file));
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
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 12,
					flexWrap: 'wrap',
					gap: 8,
				}}
			>
				<b>{getNameFile(file ?? '--')}</b>

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
			</div>
			{fileType !== EDinhDangFile.UNKNOWN ? (
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
						<ButtonExtend
							notHideText
							type='link'
							tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
							icon={<DownloadOutlined />}
							onClick={handleDownload}
						>
							{intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
						</ButtonExtend>
					</p>
				</div>
			)}
		</>
	);
};

export default PreviewFile;
