import { upperFirst } from '../../src/utils/upperFirst'
import { Ranks } from '../constants/Ranks'

/**
 * Định dạng lại tên tiếng Việt của đơn vị phân loại.
 *
 * @param rawTextVi Tên tiếng Việt của đơn vị phân loại cần định dạng lại.
 * @returns Tên tiếng Việt của đơn vị phân loại đã được định dạng.
 */
export function formatTextVi(rawTextVi: string): string {
	if (!rawTextVi) return ''

	let textVi: string = rawTextVi.trim()

	for (const rank of Ranks) {
		if (rank.regex === undefined) continue

		const regex: RegExp = RegExp(`^(?:${rank.regex.source})`, 'i')
		if (regex.test(textVi)) {
			textVi = textVi.replace(regex, '').trim()
			break
		}
	}
	textVi = upperFirst(textVi)

	return textVi
}
