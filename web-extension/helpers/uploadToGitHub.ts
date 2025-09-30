import { wait } from '../utils/wait'
import { generateGitHubPhotoId } from './generateGitHubPhotoId'

/**
 * Upload ảnh lên GitHub.
 *
 * @param photoDataUrl Dữ liệu base64 hoặc Data URL ảnh cần tải lên.
 * @param commitMessage Mô tả commit.
 * @returns ID của hình ảnh đã tải lên thành công.
 * @throws Lỗi nếu không tìm thấy GitHub token hoặc tải lên thất bại.
 */
export async function uploadToGitHub(photoDataUrl: string, commitMessage: string): Promise<string> {
	const token: string | undefined = import.meta.env.GITHUB_TOKEN
	if (token === undefined) {
		throw Error(
			'Không tìm thấy GitHub token. Vui lòng thêm biến `GITHUB_TOKEN` vào file .env và khởi động lại dev server.'
		)
	}

	// Tách phần dữ liệu base64 từ chuỗi đầu vào nếu dữ liệu đầu vào là data URL.
	const content: string | undefined = photoDataUrl.split(',').at(-1)
	if (content === undefined) {
		throw Error('Dữ liệu ảnh tải lên không đúng.')
	}

	let photoId: string
	do {
		photoId = generateGitHubPhotoId()

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
		if (res.ok) break

		// Nếu xảy ra lỗi trùng tên file, thử lại với một ID mới sau 2 giây.
		if (res.status === 422) {
			await wait(2000)
			continue
		}
		throw Error(`Tải lên GitHub lỗi: ${res.status} - ${res.statusText}`)
	} while (true)

	return photoId
}
