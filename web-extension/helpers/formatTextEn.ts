import { lowerFirst, range, upperFirst } from 'lodash-es'
import { isStartCase } from '../utils/startCase'
import { customAlphabet } from 'nanoid'

/**
 * Các địa điểm trong tên tiếng Anh của loài nên được giữ nguyên kiểu viết hoa khi định dạng. Các từ này cũng được dùng khi thu thập để xác định nếu tên tiếng Anh là một địa điểm chứ không phải tên loài.
 */
const placeNames: (string | RegExp)[] = [
	'African',
	'American',
	'Angolan',
	'Asian',
	'Atlantic',
	'California',
	'Caspian',
	'Cerro Brujo',
	'Con Dao',
	'Costa Rican',
	'Cuban',
	'Chinese',
	'Dominican',
	'Egyptian',
	'Eurasian',
	'European',
	'Himalayan',
	'Indian Ocean',
	'Indian',
	'Indonesian',
	'Japanese',
	'Korean',
	'Madagascar',
	'Moroccan',
	'New Zealand',
	'Pacific',
	'Panama',
	'Puerto Rican',
	'Sri Lanka',
	'Vietnamese',
	'Yunnan',
	'Old World',
	'New World',
	/\b\S+ Islands\b/,
	/\b\S+ Mountains\b/
]
/**
 * Các tên người trong tên tiếng Anh của loài nên được giữ nguyên kiểu viết hoa khi định dạng.
 */
const personNames: (string | RegExp)[] = []

const properNouns: (string | RegExp)[] = [...placeNames, ...personNames]
const properNounsRegex: RegExp[] = properNouns
	.map((properNoun) => {
		return typeof properNoun === 'string' ? RegExp(`\\b${properNoun}\\b`) : properNoun
	})
	.sort((properNounA, properNounB) => {
		return properNounB.source.length - properNounA.source.length
	})

const specialCharsNanoid = customAlphabet(
	range(42240, 42240 + 128)
		.map((i) => String.fromCharCode(i))
		.join(''),
	21
)

export function formatTextEn(textEn2: string | null | undefined): string {
	if (textEn2 == null) return ''

	let textEn: string = textEn2
		.trim()
		.replace(/, .+/, '')
		.replace(/^\u2013/, '')
		.replace(/^: +/, '')
		.replace(/ \(.+/, '')
		.replace(/,\s*$/, '')
		.replace(/†/g, '')
		.replace(/\u2019/g, "'")
	if (textEn.startsWith('(')) return ''

	textEn = textEn.trim()

	if (textEn) {
		for (const placeName of placeNames) {
			const matches = textEn.match(placeName)
			if (matches !== null && matches[0].length === textEn.length) {
				textEn = ''
				break
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
