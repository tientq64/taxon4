import { uploadToImgur } from './uploadToImgur'

export async function uploadToImgurFromClipboard(): Promise<string> {
	const items: ClipboardItems = await navigator.clipboard.read()
	if (items.length === 0) {
		throw Error('Clipboard trống')
	}
	const item: ClipboardItem = items[0]

	let blob: Blob | undefined = undefined
	for (const type of item.types) {
		if (type.startsWith('image/')) {
			blob = await item.getType(type)
		}
	}
	if (blob === undefined) {
		throw Error('Không tìm thấy hình ảnh nào trong clipboard')
	}
	const file: File = new File([blob], 'image.jpg')

	return uploadToImgur(file)
}
