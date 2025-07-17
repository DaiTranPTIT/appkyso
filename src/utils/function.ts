export const getFileFromUrl = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export function base64ToFile(base64String: any, fileName: string): File {
  const blob = new Blob([base64String], { type: 'application/pdf' });
  // Tạo URL cho Blob
  const url = URL.createObjectURL(blob);

  // Tạo link download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'file.pdf';
  document.body.appendChild(a);
  a.click();

  // Xóa URL sau khi tải xong
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
  return new File([blob], fileName, { type: blob.type });
}

export async function getFileFromServer(fileInfo: any, token?: string) {
  const response = await fetch(fileInfo, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  // FIX: Make sure the header names match exactly what the server is sending
  const signatureAreas = response.headers.get('signature_areas'); // Now expecting 'xheader'
  const disposition = response.headers.get("Content-Disposition");
  const filenameMatch = disposition && disposition.match(/filename="?(.+?)"?$/);
  const filename = filenameMatch ? filenameMatch[1] : "downloaded_file";
  const blob = await response.blob();
  return {
    fileContent: new File([blob], filename, { type: blob.type }),
    signatureAreas: signatureAreas ? JSON.parse(signatureAreas) : null,
  };
}