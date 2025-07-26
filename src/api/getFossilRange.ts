import { round } from 'lodash-es'
import { GeoTimeType } from '../constants/geoTimes'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { findGeoTime } from '../helpers/findGeoTime'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'
import { parseHtml } from '../utils/parseHtml'

export interface FossilRange {
	readonly isFossilRange: true
	startMa: number
	endMa: number
	duration: number
	isEstimate: boolean
}

export interface RecentExtinction {
	readonly isRecentExtinction: true
	extinctionTime: string
}

export async function getFossilRange(taxon: Taxon): Promise<FossilRange | RecentExtinction | null> {
	const q: string = getTaxonWikipediaQueryName(taxon, 'en')
	const requestUrl: string = `https://en.wikipedia.org/api/rest_v1/page/mobile-html/${q}`

	const res: Response = await fetch(requestUrl, {
		headers: fetchHeaders
	})
	if (!res.ok) return null

	const html: string = await res.text()
	const dom: Document = parseHtml(html)

	return extractFossilRange(dom) ?? extractRecentExtinction(dom) ?? null
}

function extractFossilRange(dom: Document): FossilRange | undefined {
	const infobox = dom.querySelector<HTMLTableElement>('table.infobox')
	if (infobox === null) return

	const th = infobox.querySelector<HTMLTableCellElement>('th')
	if (th === null) return

	const text: string | null = th.textContent
	if (text === null) return

	let isEstimate: boolean = false
	let startMa: number | undefined = undefined
	let endMa: number | undefined = undefined

	const startEndMaRegex = /(~)?(\d+(?:\.\d+)?)(?:\s*[-\u2013]\s*(\d+(?:\.\d+)?))?\s+Ma/
	const startEndMaMatches = startEndMaRegex.exec(text)
	if (startEndMaMatches !== null) {
		isEstimate = Boolean(startEndMaMatches[1])
		startMa = Number(startEndMaMatches[2])
		endMa = Number(startEndMaMatches[3] ?? startMa)
	}

	const geoTimeRegex = /Temporal range:([A-Za-z0-9\s]+)/i
	const geoTimeMatches = geoTimeRegex.exec(text)
	if (geoTimeMatches !== null) {
		const parts: string[] = geoTimeMatches[1]
			.split('\n', 1)[0]
			.trim()
			.split(/\s*[-\u2013/]\s*|\sto\s/)
		const startGeoTimeText: string = parts[0]
		const endGeoTimeText: string | undefined = parts.at(1)

		const startGeoTime: GeoTimeType | undefined = findGeoTime(startGeoTimeText)
		const endGeoTime: GeoTimeType | undefined = findGeoTime(
			endGeoTimeText ?? startGeoTimeText,
			true
		)

		if (startGeoTime !== undefined) {
			startMa ??= startGeoTime.startMa
		}
		if (endGeoTime !== undefined) {
			endMa ??= endGeoTime.endMa
		}
	}

	if (startMa === undefined || endMa === undefined) return

	const duration: number = round(startMa - endMa, 8)

	return {
		isFossilRange: true,
		startMa,
		endMa,
		duration,
		isEstimate
	}
}

function extractRecentExtinction(dom: Document): RecentExtinction | undefined {
	const infobox = dom.querySelector<HTMLTableElement>('table.infobox')
	if (infobox === null) return

	const extinctLink = infobox.querySelector<HTMLAnchorElement>('a[title="Extinction"]')
	if (extinctLink === null) return

	const extinctionTimeText: string | null | undefined = extinctLink.parentElement?.textContent
	if (extinctionTimeText == null) return

	const extinctionTimeRegex: RegExp = /\([^()]*\b([12]\d{3}s?|\d+(th|st|nd|rd))\b[^()]*\)/
	const extinctionTimeMatches: RegExpExecArray | null =
		extinctionTimeRegex.exec(extinctionTimeText)
	if (extinctionTimeMatches === null) return

	const extinctionTime: string = extinctionTimeMatches[0]
		.replace(/\((.+)\)/, '$1')
		.replace(/[()]/g, '')
		.trim()

	return {
		isRecentExtinction: true,
		extinctionTime
	}
}
