import { wait } from '../utils/wait'
import { numToRadix62 } from './numToRadix62'

/**
 * Thời gian Unix tính theo giây. Được dùng để tính toán ID của hình ảnh được tải lên
 * GitHub.
 */
const startTime: number = 1752970240

/**
 * Upload ảnh lên GitHub.
 *
 * @param photoDataUrl DataURL ảnh cần tải lên.
 * @param commitMessage Mô tả commit.
 * @returns ID của hình ảnh đã tải lên.
 */
export async function uploadToGitHub(photoDataUrl: string, commitMessage: string): Promise<string> {
	const token: string | undefined = import.meta.env.GITHUB_TOKEN
	if (token === undefined) {
		throw Error(
			'Không tìm thấy GitHub token. Vui lòng thêm biến `GITHUB_TOKEN` vào file .env và khởi động lại dev server.'
		)
	}

	const content: string | undefined = photoDataUrl.split(',').at(-1)
	if (content === undefined) {
		throw Error('Dữ liệu ảnh tải lên không đúng.')
	}

	let photoId: string
	do {
		const num: number = Math.floor(Date.now() / 1000 - startTime)
		photoId = numToRadix62(num).replace('-', '')

		const gitHubApiUrl: string = `https://api.github.com/repos/tientq64/taimg/contents/${photoId}.webp`

		const res = await fetch(gitHubApiUrl, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'image/webp'
			},
			body: JSON.stringify({
				message: commitMessage,
				content
			})
		})
		if (!res.ok) {
			if (res.status === 422) {
				await wait(2000)
				continue
			} else {
				throw Error(`Tải lên GitHub lỗi: ${res.status} - ${res.statusText}`)
			}
		}

		break
	} while (true)

	return photoId
}
