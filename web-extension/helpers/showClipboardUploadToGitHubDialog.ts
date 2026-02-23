import { ext } from '../store/ext'
import { blobToDataUrl } from '../utils/blobToDataUrl'
import { getFirstClipboardItemAsImageBlob } from './getFirstClipboardItemAsImageBlob'
import { showToast } from './showToast'

export async function showClipboardUploadToGitHubDialog(): Promise<void> {
	const photoBlob: Blob | undefined = await getFirstClipboardItemAsImageBlob()
	if (!photoBlob) {
		const error = Error('Không tìm thấy hình ảnh nào trong clipboard')
		showToast(error)
		throw error
	}

	const photoDataUrl: string = await blobToDataUrl(photoBlob)
	ext.gitHubUploadImageUrl = photoDataUrl
}
