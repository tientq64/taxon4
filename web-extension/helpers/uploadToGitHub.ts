import { wait } from '../utils/wait'
import { numToRadix62 } from './numToRadix62'

const startTime: number = 1749287430

/**
 * Upload ảnh lên GitHub.
 *
 * @param dataUrl DataURL ảnh cần tải lên.
 * @param message Tin nhắn commit.
 * @returns Id của hình ảnh đã tải lên.
 */
export async function uploadToGitHub(dataUrl: string, message: string): Promise<string> {
	const token: string | undefined = import.meta.env.GITHUB_TOKEN
	if (token === undefined) {
		throw Error('Không tìm thấy GitHub token.')
	}

	const content: string = dataUrl.split(',')[1]

	let id: string
	do {
		const num: number = Math.floor(Date.now() / 1000 - startTime)
		id = numToRadix62(num).replace('-', '')

		const res = await fetch(`https://api.github.com/repos/tientq64/taimg/contents/${id}.webp`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'image/webp'
			},
			body: JSON.stringify({
				message,
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

	return id
}
