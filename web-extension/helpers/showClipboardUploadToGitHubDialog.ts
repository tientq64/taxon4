import { ext } from '../store/ext'
import { blobToDataUrl } from '../utils/blobToDataUrl'
import { showToast } from './showToast'

export async function showClipboardUploadToGitHubDialog(): Promise<void> {
	const items: ClipboardItems = await navigator.clipboard.read()
	if (items.length === 0) {
		const error = Error('Clipboard trống')
		showToast(error)
		throw error
	}
	const item: ClipboardItem = items[0]

	let photoBlob: Blob | undefined = undefined
	for (const type of item.types) {
		if (type.startsWith('image/')) {
			photoBlob = await item.getType(type)
		}
	}
	if (photoBlob === undefined) {
		const error = Error('Không tìm thấy hình ảnh nào trong clipboard')
		showToast(error)
		throw error
	}
	const photoDataUrl: string = await blobToDataUrl(photoBlob)

	ext.gitHubUploadImageUrl = photoDataUrl
}
