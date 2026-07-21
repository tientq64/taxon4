interface ImgbbUploadResult {
	data: {
		delete_url: string
		display_url: string
		expiration: number
		height: number
		id: string
		image: ImgbbImageFormat
		medium?: ImgbbImageFormat
		size: number
		thumb: ImgbbImageFormat
		time: number
		title: string
		url: string
		url_viewer: string
		width: number
	}
	status: number
	success: boolean
}

interface ImgbbImageFormat {
	extension: string
	filename: string
	mime: string
	name: string
	url: string
}

const imgbbUploadImageApiUrl: string = 'https://api.imgbb.com/1/upload'

/**
 * Upload hình ảnh lên Imgbb.
 *
 * @param data Dữ liệu hình ảnh cần tải lên. Có thể là file nhị phân, dữ liệu base64, hoặc
 *   URL hình ảnh.
 * @returns ID của hình ảnh đã tải lên.
 * @throws Ném lỗi nếu không tìm thấy API key, tải lên không thành công, hoặc ID ảnh trả
 *   về không hợp lệ.
 */
export async function uploadToImgbb(data: string): Promise<string> {
	const apiKey: string | undefined = import.meta.env.IMGBB_API_KEY
	if (!apiKey) {
		throw Error(
			'Không tìm thấy Imgbb API key. Vui lòng thêm biến `IMGBB_API_KEY` vào file .env tại thư mục gốc và khởi động lại dev server.'
		)
	}

	const body = new FormData()

	body.append('key', import.meta.env.IMGBB_API_KEY)
	body.append('name', 'i')
	body.append('image', data)

	const res = await fetch(imgbbUploadImageApiUrl, {
		method: 'POST',
		body
	})
	const result: ImgbbUploadResult = await res.json()

	if (!result.success) {
		throw result
	}
	const id: string | undefined = result.data.display_url.split('/').at(3)
	if (id === undefined || !/^[\w-]+$/.test(id)) {
		throw Error('ID hình ảnh Imgbb không hợp lệ.')
	}

	return id
}
