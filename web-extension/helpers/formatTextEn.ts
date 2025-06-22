import { range } from 'lodash-es'
import { customAlphabet } from 'nanoid'
import { lowerFirst } from '../../src/utils/lowerFirst'
import { upperFirst } from '../../src/utils/upperFirst'
import { placeNames } from '../constants/placeNames'
import { properNounsRegex } from '../constants/properNouns'
import { isStartCase } from '../utils/startCase'

const specialChars: string = range(42240, 42240 + 128)
	.map((i) => String.fromCharCode(i))
	.join('')
const specialCharsNanoid = customAlphabet(specialChars, 21)

/**
 * Định dạng lại tên tiếng Anh của đơn vị phân loại.
 *
 * @param rawTextEn Tên tiếng Anh của đơn vị phân loại cần định dạng lại.
 * @returns Tên tiếng Anh của đơn vị phân loại đã được định dạng.
 */
export function formatTextEn(rawTextEn: string | null | undefined): string {
	if (!rawTextEn) return ''

	// Loại bỏ các chuỗi không cần thiết.
	let textEn: string = rawTextEn
		.trim()
		.replace(/[,;/] .+/u, '')

		// Các dấu gạch ngang ở đầu.
		.replace(/^[-\u2010-\u2015]/, '')

		.replace(/^: +/, '')
		.replace(/ \(.+/, '')
		.replace(/ \($/, '')
		.replace(/ - .+/, '')
		.replace(/ -$/, '')
		.replace(/,\s*$/, '')
		.replace(/†/g, '')
		.replace(/ or .+$/g, '')

		// Loại bỏ từ "family" ở cuối tên một số họ thực vật, và chuyển thành dạng số nhiều.
		.replace(/(s|sh|ch|z|x) family$/, '$1es')
		.replace(/([bcdfghjklmnpqrstvwxz]o) family$/, '$1es')
		.replace(/([aeiouy]o) family$/, '$1s')
		.replace(/([bcdfghjklmnpqrstvwxz])y family$/, '$1ies')
		.replace(/(fe?) family$/, 'ves')
		.replace(/(.) family$/, '$1s')

		// Các dấu giống dấu nháy đơn.
		.replace(/[\u2018\u2019]/g, "'")

		// Các dấu giống dấu gạch ngang.
		.replace(/[\u2010-\u2015]/g, '-')

		.replace(/^\d+ spp?\.$/, '')

		.replace(/\[\d+\]/g, '')
		.trim()

	if (textEn[0] === '(') return ''
	if (textEn.length <= 1) return ''

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
