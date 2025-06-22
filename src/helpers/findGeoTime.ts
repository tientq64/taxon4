import { t } from 'i18next'
import { epochs } from '../constants/epochs'
import { GeoTimeName, GeoTimeType } from '../constants/geoTimes'
import { LanguageCode } from '../constants/languages'
import { periods } from '../constants/periods'
import { subEpochs } from '../constants/subEpochs'

const geoTimes: GeoTimeType[] = [...periods, ...epochs, ...subEpochs]

export function findGeoTime(geoTimeText: GeoTimeName, fromLast?: boolean): GeoTimeType
export function findGeoTime(geoTimeText: string, fromLast?: boolean): GeoTimeType | undefined

export function findGeoTime(
	geoTimeText: GeoTimeName | string,
	fromLast: boolean = false
): GeoTimeType | undefined {
	const formatedGeoTimeText: string = geoTimeText
		.trim()
		.toLowerCase()
		.replace(/\s{2,}/g, ' ')
		.replace(/\s+(period|epoch)$/, '')
		.replace(/\blower\b/, 'early')
		.replace(/\bmid\b/, 'middle')
		.replace(/\bupper\b/, 'late')
		.trim()

	const finder = (geoTime: GeoTimeType) => {
		const geoTimeTextEn: string = t(`${geoTime.rankName}.${geoTime.name}`, {
			lng: LanguageCode.En,
			defaultValue: geoTime.name
		})
		const geoTimeTexts: string[] = [geoTimeTextEn, ...geoTime.aliasTexts].map((geoTimeText) =>
			geoTimeText.toLowerCase()
		)

		return geoTimeTexts.includes(formatedGeoTimeText)
	}

	return fromLast ? geoTimes.findLast(finder) : geoTimes.find(finder)
}
