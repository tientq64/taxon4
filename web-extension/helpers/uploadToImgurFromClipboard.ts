import { getFirstClipboardItemAsImageBlob } from './getFirstClipboardItemAsImageBlob'
import { uploadToImgur } from './uploadToImgur'

export async function uploadToImgurFromClipboard(): Promise<string> {
	const blob = await getFirstClipboardItemAsImageBlob()
	if (!blob) {
		throw Error('Không tìm thấy hình ảnh nào trong clipboard')
	}
	const file: File = new File([blob], 'image.jpg')
	return uploadToImgur(file)
}
