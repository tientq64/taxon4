import { numToRadix62 } from './numToRadix62'

export function generateGitHubPhotoId(): string {
	/**
	 * Thời gian Unix tính theo milli giây. Được dùng để tính toán ID của hình ảnh được
	 * tải lên GitHub.
	 */
	const startTimeMs = 1792197974952

	const startTime = Math.floor(startTimeMs / 1000)
	const currentTime = Math.floor(Date.now() / 1000)
	const num = currentTime - startTime

	const gitHubPhotoId = numToRadix62(num)
		// Thay bỏ dấu trừ nếu chẳng may số là số âm.
		.replace('-', '')
	return gitHubPhotoId
}
