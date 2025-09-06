import { numToRadix62 } from './numToRadix62'

export function generateGitHubPhotoId(): string {
	/**
	 * Thời gian Unix tính theo giây. Được dùng để tính toán ID của hình ảnh được tải lên
	 * GitHub.
	 */
	const startTime: number = 1757095190

	const num: number = Math.floor(Date.now() / 1000 - startTime)
	return numToRadix62(num).replace('-', '')
}
