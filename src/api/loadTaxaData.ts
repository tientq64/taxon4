import { dataPartNames } from '../constants/dataPartNames'
import { parse, Taxon } from '../helpers/parse'
import { app } from '../store/app'
import { Dict } from '../types/common'

/**
 * Load tất cả các file dữ liệu phân loại sinh học và trả về danh sách tất cả các đơn vị
 * phân loại.
 */
export async function loadTaxaData(): Promise<Taxon[]> {
	const paths: string[] = [
		'data/data.taxon4',
		...dataPartNames.map((name) => `data/parts/${name}.taxon4`)
	]
	const entries: [string, string][] = await Promise.all(
		paths.map(async (path, i) => {
			const key: string = dataPartNames[i - 1]
			const text: string = await fetch(path).then((res) => res.text())
			return [key, text]
		})
	)
	const map: Dict = Object.fromEntries(entries.slice(1))

	let data: string = entries[0][1]

	for (let i = 0; i < paths.length; i++) {
		let done = true
		data = data.replace(/ {{([^+][A-Za-z0-9-]+)}}$/gm, (_, key) => {
			const text: string | undefined = map[key]
			if (text === undefined) {
				throw Error(`Không tìm thấy tập tin "data/parts/${key}.taxon4".`)
			}
			done = false
			const fileLineCount: number = text.split('\n').length
			return ` {{+${fileLineCount}}}\n${text}`
		})
		if (done) break
	}

	const fileLineCount: number = entries[0][1].split('\n').length
	const taxa: Taxon[] = parse(data, fileLineCount, app.developerModeEnabled)
	return taxa
}
