// Khóa lưu trong localStorage để đánh dấu các hướng dẫn đã được hiển thị
const JOYRIDE_STORAGE_KEY = 'joyrideShown';

/**
 * Kiểm tra xem một hướng dẫn cụ thể đã được hiển thị hay chưa.
 *
 * @param key - Tên định danh duy nhất cho từng hướng dẫn (ví dụ: 'caiDatInBangDiem')
 * @returns true nếu hướng dẫn đã hiển thị, false nếu chưa
 */
export const isJoyrideShown = (key: string): boolean => {
	const stored = localStorage.getItem(JOYRIDE_STORAGE_KEY);

	const map = stored ? JSON.parse(stored) : {};
	return !!map[key];
};

/**
 * Đánh dấu một hướng dẫn cụ thể là "đã hiển thị".
 *
 * @param key - Tên định danh duy nhất cho từng hướng dẫn (ví dụ: 'caiDatInBangDiem')
 */
export const setJoyrideShown = (key: string): void => {
	const stored = localStorage.getItem(JOYRIDE_STORAGE_KEY);
	const map = stored ? JSON.parse(stored) : {};
	map[key] = true;
	localStorage.setItem(JOYRIDE_STORAGE_KEY, JSON.stringify(map));
};
