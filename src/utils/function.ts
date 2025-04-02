export const getFileFromUrl = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
};

export function base64ToFile(base64String: string, filename: string): File {
    // Tách chuỗi header và phần dữ liệu Base64
    const arr = base64String.split(',');
    let mime = '';
    let bstr = '';
  
    // Nếu có header, lấy MIME type và phần dữ liệu
    if (arr.length === 2) {
      const header = arr[0];
      bstr = arr[1];
      const mimeMatch = header.match(/:(.*?);/);
      if (mimeMatch) {
        mime = mimeMatch[1];
      }
    } else {
      // Nếu không có header, giả sử toàn bộ chuỗi là dữ liệu và không có MIME type
      bstr = base64String;
    }
  
    // Giải mã chuỗi Base64
    const byteString = atob(bstr);
    const n = byteString.length;
    const u8arr = new Uint8Array(n);
  
    for (let i = 0; i < n; i++) {
      u8arr[i] = byteString.charCodeAt(i);
    }
  
    return new File([u8arr], filename, { type: mime });
  }