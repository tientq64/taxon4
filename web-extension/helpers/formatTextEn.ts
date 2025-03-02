import { lowerFirst, range, upperFirst } from 'lodash-es'
import { customAlphabet } from 'nanoid'
import { placeNames } from '../constants/placeNames'
import { properNounsRegex } from '../constants/properNouns'
import { isStartCase } from '../utils/startCase'

const specialChars: string = range(42240, 42240 + 128)
	.map((i) => String.fromCharCode(i))
	.join('')
const specialCharsNanoid = customAlphabet(specialChars, 21)

/**
 * Định dạng lại tên tiếng Anh đơn vị phân loại.
 *
 * @param textEn2 Tên tiếng Anh đơn vị phân loại cần định dạng lại.
 * @returns Tên tiếng Anh đơn vị phân loại đã được định dạng.
 */
export function formatTextEn(textEn2: string | null | undefined): string {
	if (!textEn2) return ''

	// Loại bỏ các chuỗi không cần thiết.
	let textEn: string = textEn2
		.trim()
		.replace(/[,;/] .+/u, '')

		// Các dấu gạch ngang ở đầu.
		.replace(/^[-\u2010-\u2015]/, '')

		.replace(/^: +/, '')
		.replace(/ \(.+/, '')
		.replace(/,\s*$/, '')
		.replace(/†/g, '')

		// Các dấu giống dấu nháy đơn.
		.replace(/[\u2018\u2019]/g, "'")

		// Các dấu giống dấu gạch ngang.
		.replace(/[\u2010-\u2015]/g, '-')

		.replace(/\[\d+\]/g, '')

	if (textEn.startsWith('(')) return ''

	textEn = textEn.trim()

	if (textEn === '"') return ''
	if (textEn === ':') return ''

	// Nếu đây là tên địa điểm chứ không phải tên tiếng Anh của đơn vị phân loại, trả về chuỗi rỗng và thoát.
	if (textEn) {
		for (const placeName of placeNames) {
			const matches = textEn.match(placeName)
			if (matches !== null && matches[0].length === textEn.length) {
				return ''
			}
		}
	}

	if (textEn) {
		if (isStartCase(textEn)) {
			const placeholders: Record<string, string> = {}
			for (const properNounRegex of properNounsRegex) {
				if (properNounRegex.test(textEn)) {
					const nid: string = specialCharsNanoid()
					textEn = textEn.replace(properNounRegex, (properNoun) => {
						placeholders[nid] = properNoun
						return nid
					})
				}
			}
			textEn = textEn
				.split(/([ -])/)
				.map((word, i) => {
					if (i % 2 === 1) {
						return word
					}
					if (placeholders[word]) {
						return placeholders[word]
					}
					if (word === word.toUpperCase()) {
						return word
					}
					return lowerFirst(word)
				})
				.join('')
		}
	}

	textEn = upperFirst(textEn)

	return textEn
}
