import { upperFirst } from 'lodash-es'
import { Ranks } from '../models/Ranks'

export function formatTextVi(textVi: string): string {
	textVi = textVi.trim()

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
