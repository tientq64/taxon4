import { personNames } from './personNames'
import { placeNames } from './placeNames'

export const properNouns: (string | RegExp)[] = [...placeNames, ...personNames]

export const properNounsRegex: RegExp[] = properNouns
	.map((properNoun) => {
		if (typeof properNoun === 'string') {
			return RegExp(`\\b${properNoun}\\b`)
		}
		return properNoun
	})
	.sort((properNounA, properNounB) => {
		return properNounB.source.length - properNounA.source.length
	})
