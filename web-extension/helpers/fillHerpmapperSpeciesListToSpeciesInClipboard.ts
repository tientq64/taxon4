import { RanksMap } from '../constants/Ranks'
import { ext } from '../store/ext'
import { copyText, readCopiedText } from '../utils/clipboard'
import { formatTextEn } from './formatTextEn'
import { showToast } from './showToast'

export async function fillHerpmapperSpeciesListToSpeciesInClipboard(): Promise<void> {
	const { sites } = ext

	if (!sites.herpmapper) return

	const taxaStr: string = await readCopiedText()

	const taxonLines: string[][] = taxaStr
		.replace(/^\r?\n/, '')
		.split(/\r?\n/)
		.map((taxonLine) => {
			return taxonLine.replace(' - /', ' -  /').split(/(\t+| - | \/ | \| )/)
		})
		.slice(1)

	const rows = document.querySelectorAll<HTMLTableRowElement>('table.table-striped > tbody > tr')
	if (rows.length === 0) {
		showToast('Không tìm thấy bảng danh sách các loài trên trang này')
		return
	}

	for (const row of rows) {
		const commonName: string = row.cells[1].textContent!.trim()
		if (commonName === '') continue

		const binomialName: string = (row.cells[0].textContent ?? '').trim()
		const taxonName: string = binomialName.split(' ').at(-1)!

		for (const chunk of taxonLines) {
			if (chunk[0].length !== RanksMap.species.level - 1) continue
			if (chunk[1] !== taxonName) continue
			if (chunk[2] !== ' - ') {
				const formatedCommonName: string = formatTextEn(commonName)
				chunk.splice(2, 0, ' - ', formatedCommonName)
			}
			row.classList.add('opacity-30')
			break
		}
	}

	let copyingText: string = taxonLines
		.map((chunk) => {
			return chunk.join('').replace(' -  /', ' - /')
		})
		.join('\n')
	copyingText = '\n' + copyingText

	copyText(copyingText)
	showToast('Đã thêm tên tiếng Anh vào danh sách loài trong clipboard')
}
