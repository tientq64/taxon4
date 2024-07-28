import { upperFirst } from 'lodash-es'

export function formatTextEn(textEn: string | null | undefined): string {
	if (textEn == null) return ''

	textEn = textEn.trim()

	textEn = textEn
		.replace(/^\u2013/, '')
		.replace(/ \(.+/, '')
		.replace(/,\s*$/, '')
	if (textEn.startsWith('(')) return ''

	textEn = upperFirst(textEn.trim())
	return textEn
}
