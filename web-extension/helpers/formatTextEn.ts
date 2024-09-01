import { lowerFirst, range, upperFirst } from 'lodash-es'
import { isStartCase } from '../utils/startCase'
import { customAlphabet } from 'nanoid'

const properNouns: (string | RegExp)[] = [
	'New Zealand',
	'Japanese',
	'Moroccan',
	'Indian',
	'European',
	'Eurasian',
	'American',
	'African',
	'Pacific',
	'Atlantic',
	'Indian Ocean',
	'Egyptian',
	'Sri Lanka',
	/\b\S+ Islands\b/
]
const properNounRegexes: RegExp[] = properNouns.map((properNoun) =>
	typeof properNoun === 'string' ? RegExp(`\\b${properNoun}\\b`) : properNoun
)

const nanoid = customAlphabet(
	range(42240, 42240 + 128)
		.map((i) => String.fromCharCode(i))
		.join(''),
	21
)

export function formatTextEn(textEn2: string | null | undefined): string {
	if (textEn2 == null) return ''

	let textEn: string = textEn2.trim()

	textEn = textEn
		.replace(/^\u2013/, '')
		.replace(/ \(.+/, '')
		.replace(/,\s*$/, '')
	if (textEn.startsWith('(')) return ''
	textEn = textEn.trim()

	if (isStartCase(textEn)) {
		const placeholders: Record<string, string> = {}
		for (const properNounRegex of properNounRegexes) {
			if (properNounRegex.test(textEn)) {
				const nid: string = nanoid()
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

	textEn = upperFirst(textEn)
	return textEn
}
