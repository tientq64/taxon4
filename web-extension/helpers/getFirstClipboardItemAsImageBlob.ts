/**
 * Trả về blob hình ảnh nếu item đầu tiên trong clipboard là hình ảnh.
 *
 * @returns Blob hình ảnh hoặc `undefined` nếu không tìm thấy.
 */
export async function getFirstClipboardItemAsImageBlob(): Promise<Blob | undefined> {
	const items = await navigator.clipboard.read()
	const item = items.at(0)
	if (!item) return

	for (const type of item.types) {
		if (!type.startsWith('image/')) continue

		const blob = await item.getType(type)
		return blob
	}
}
