import { dataPartNames } from '../constants/dataPartNames'
import { joinDataPartFiles } from '../helpers/joinDataPartFiles'
import { parse, Taxon } from '../helpers/parse'
import { app } from '../store/app'

/**
 * Load tất cả các file dữ liệu phân loại sinh học và trả về danh sách tất cả các đơn vị
 * phân loại.
 */
export async function loadTaxaData(): Promise<Taxon[]> {
	app.loadedDataPartProgress = 0

	const paths = dataPartNames.map((name) => `data/${name}.taxon4`)

	const entries: [string, string][] = await Promise.all(
		paths.map(async (path, i) => {
			const dataPartName: string = dataPartNames[i]
			const content: string = await fetch(path).then(async (res) => {
				const text = await res.text()
				app.loadedDataPartProgress++
				return text
			})
			return [dataPartName, content]
		})
	)

	const data = joinDataPartFiles(entries)

	return parse(data, app.developerModeEnabled)
}
