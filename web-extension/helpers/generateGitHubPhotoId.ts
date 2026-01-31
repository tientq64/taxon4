import { numToRadix62 } from './numToRadix62'

export function generateGitHubPhotoId(): string {
	/**
	 * Thời gian Unix tính theo milli giây. Được dùng để tính toán ID của hình ảnh được
	 * tải lên GitHub.
	 */
	const startTimeMs: number = 1769057223541

	const startTime: number = Math.floor(startTimeMs / 1000)
	const currentTime: number = Math.floor(Date.now() / 1000)
	const num: number = currentTime - startTime

	const gitHubPhotoId: string = numToRadix62(num)
		// Thay bỏ dấu trừ nếu chẳng may số là số âm.
		.replace('-', '')
	return gitHubPhotoId
}
