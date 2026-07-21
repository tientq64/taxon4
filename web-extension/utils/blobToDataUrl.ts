/**
 * Chuyển Blob sang DataURL.
 *
 * @throws Lỗi nếu quá trình chuyển đổi thất bại.
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
	const { promise, resolve, reject } = Promise.withResolvers<string>()

	const reader = new FileReader()
	reader.onload = () => {
		if (typeof reader.result !== 'string') {
			reject('Kết quả không phải là DataURL')
			return
		}
		resolve(reader.result)
	}
	reader.readAsDataURL(blob)

	return promise
}
