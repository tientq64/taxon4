/**
 * Khớp URL trang hiện tại với mẫu so khớp.
 *
 * @example
 * 	location.href = 'https://en.wikipedia.org/wiki/Main_Page'
 *
 * 	matchUrl('https://en.wikipedia.org/^+') // true
 * 	matchUrl('https://en\.wikipedia\.org/.+') // false
 * 	matchUrl('https://en.wikipedia.org/^') // false
 * 	matchUrl('https://en.wikipedia.org') // false
 * 	matchUrl('en.wikipedia.org') // false
 *
 * @param regexV2Text Mẫu so khớp là regex nhưng với cú pháp khác một chút. Dấu `.` sẽ
 *   được giữ nguyên như ký tự dấu chấm bình thường. Dấu `^` sẽ khớp với một ký tự bất kỳ.
 *   Mẫu so khớp phải là toàn bộ URL, không chỉ một phần.
 */
export function matchUrl(regexV2Text: string): boolean {
	const regexSource: string = regexV2Text.replace(/\./g, '\\.').replace(/(?<!\\)\^/g, '.')
	const regex: RegExp = RegExp(`^${regexSource}$`)

	return regex.test(location.href)
}
