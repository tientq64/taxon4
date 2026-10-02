import { Dict } from '../types/common'

/**
 * Nối nội dung các file dữ liệu phân loại sinh học lại thành một file duy nhất.
 *
 * @param dataPartEntries Một mảng nội dung các file. Mỗi phần tử đại diện cho một file
 *   gồm 2 phần: Phần tử đầu tiên là tên file, không bao gồm phần mở rộng. Phần tử thứ hai
 *   là nội dung file.
 * @returns Nội dung file đã nối.
 */
export function joinDataPartFiles(dataPartEntries: [string, string][]): string {
	const dataPartsMap: Dict = Object.fromEntries(dataPartEntries)

	let data = dataPartsMap['Life']
	const rootFileLineCount = data.split('\n').length

	for (let i = 0; i < dataPartEntries.length; i++) {
		let done = true
		data = data.replace(/ {{([^+][A-Za-z0-9\-_]+)}}$/gm, (_, key) => {
			const text: string | undefined = dataPartsMap[key]
			if (text === undefined) {
				throw Error(`Không tìm thấy tập tin "data/${key}.taxon4".`)
			}
			done = false
			const fileLineCount = text.split('\n').length
			return ` {{+${fileLineCount}}}\n${text}`
		})
		if (done) break
	}
	data = `${rootFileLineCount}\n${data}`

	return data
}
