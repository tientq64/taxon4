import { RanksMap } from '../../src/constants/ranks'
import { ext } from '../store/ext'
import { copyText, readCopiedText } from '../utils/clipboard'
import { $ } from '../utils/jquery'
import { formatTextEn } from './formatTextEn'
import { showToast } from './showToast'

export async function fillRepfocusSpeciesListToSpeciesInClipboard(): Promise<void> {
	const { sites } = ext

	if (!sites.repfocus) return

	const taxaStr: string = await readCopiedText()
	const taxonLines: string[][] = taxaStr
		.replace(/^\r?\n/, '')
		.split(/\r?\n/)
		.map((taxonLine) => {
			return taxonLine
				.replace(' - /', ' -  /')
				.split(/(\t+| - | \/ | \| )/)
				.slice(1)
		})

	const rows = document.querySelectorAll<HTMLTableRowElement>('tr.species')
	if (rows.length === 0) {
		showToast('Không tìm thấy bảng danh sách các loài trên trang này')
		return
	}
	for (const row of rows) {
		const commonName: string = $(row).find('span.comname').first().text().trim()
		if (commonName === '') continue

		const binomialName: string = $(row).find('i.binomial').first().text().trim()
		const taxonName: string | undefined = binomialName.split(' ').at(-1)
		if (taxonName === undefined) continue

		for (const chunk of taxonLines) {
			if (chunk[0].length !== RanksMap.species.level - 1) continue
			if (chunk[1] !== taxonName) continue
			if (chunk[2] !== ' - ') {
				chunk.splice(2, 0, ' - ', '')
			}
			const formatedCommonName: string = formatTextEn(commonName)
			chunk[3] = formatedCommonName
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
