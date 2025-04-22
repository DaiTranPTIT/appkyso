import { EDinhDangFile } from '@/services/base/constant';
import type { IFileInfo } from '@/services/base/typing';
import { getFileInfo } from '@/services/uploadFile';
import { ip3 } from '@/utils/ip';
import { getFileType, getNameFile } from '@/utils/utils';
import { CopyOutlined, DownloadOutlined, RightOutlined } from '@ant-design/icons';
import { message, Space, Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import ButtonExtend from '../Table/ButtonExtend';
import type { TPreviewFileProps } from './typing';

type TFrameProps = {
	url: string;
	type: EDinhDangFile;
	name?: string;
	src?: string;
};

const PreviewFile: React.FC<TPreviewFileProps> = (props) => {
	const intl = useIntl();
	const { file, style = {}, children, ip = ip3, isFileId } = props;
	const [frameData, setFrameData] = useState<TFrameProps>();
	const [loading, setLoading] = useState(false);

	const getFileExtension = (url: string) => {
		const arr = url.split('.');
		return arr.length > 1 ? arr.at(-1) : '';
	};

	const getIframeSrc = (type: EDinhDangFile, fileUrl?: string) => {
		if (!fileUrl) return '';
		const officeFileType = [EDinhDangFile.WORD, EDinhDangFile.EXCEL, EDinhDangFile.POWERPOINT];
		if (type && officeFileType.includes(type)) {
			return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
		} else {
			return fileUrl;
		}
	};

	const getFileDataFromUrl = async (srcUrl: string) => {
		const idFile = isFileId ? srcUrl : srcUrl.split('/')[srcUrl.length - 2];
		const frame: TFrameProps = {
			url: srcUrl,
			type: EDinhDangFile.UNKNOWN,
		};

		try {
			// Nếu có thông tin id file thì get thông tin chi tiết
			if (idFile) {
				setLoading(true);
				const result = await getFileInfo(idFile, ip);
				const fileInfo: IFileInfo = result?.data?.data;
				frame.url = fileInfo?.url ?? (!isFileId ? srcUrl : '');
				frame.name = fileInfo?.name;

				// Mapping { mimetype : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"} sang EDinhDangFile
				frame.type =
					getFileType(fileInfo?.mimetype ? fileInfo.mimetype : getFileExtension(frame.url) ?? '') ||
					EDinhDangFile.UNKNOWN;
			} else {
				frame.type = getFileType(getFileExtension(srcUrl) ?? '') || EDinhDangFile.UNKNOWN;
			}

			// Fill other props
			if (frame.url && !frame.name) frame.name = getNameFile(frame.url);
			frame.src = getIframeSrc(frame.type, frame.url);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
		return frame;
	};

	useEffect(() => {
		const fetchFileType = async () => {
			const res = await getFileDataFromUrl(file);
			setFrameData(res);
		};

		fetchFileType();
	}, [file]);

	const handleDownload = async () => {
		if (frameData?.url) {
			try {
				const response = await fetch(frameData?.url);
				const blob = await response.blob();
				fileDownload(blob, getNameFile(frameData?.url));
			} catch (error) {
				console.error('Error downloading file:', error);
			}
		}
	};

	const handleCopy = () => {
		if (frameData?.url) {
			navigator.clipboard
				.writeText(frameData?.url)
				.then(() => {
					message.success(intl.formatMessage({ id: 'global.previewfile.message.saochep' }));
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	if (loading)
		return (
			<div style={{ width: '100%', height: '100%', ...style }}>
				<Spin size='large' />
			</div>
		);
	return (
		<div style={{ width: '100%', height: '100%', ...style }}>
			<Space wrap align='center' style={{ justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
				<b>{frameData?.name ?? '--'}</b>

				<Space wrap>
					{!!frameData?.url && (
						<>
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
						</>
					)}

					{!!frameData?.src && (
						<ButtonExtend
							type='link'
							tooltip={intl.formatMessage({ id: 'global.previewfile.button.morong' })}
							icon={<RightOutlined />}
							onClick={() => window.open(frameData?.src, '_blank')}
						/>
					)}

					{children}
				</Space>
			</Space>

			{frameData?.type !== EDinhDangFile.UNKNOWN && !!frameData?.src ? (
				<iframe src={frameData.src} style={{ height: 'calc(100% - 44px)', width: '100%', minHeight: 500 }} />
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

						{!!frameData?.url && (
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
		</div>
	);
};

export default PreviewFile;
