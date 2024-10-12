import { invert } from 'lodash-es'
import { inaturalistToExtsMap } from '../../src/helpers/parsePhotoCode'
import { lowerFirst } from '../../src/utils/lowerFirst'

export const inaturalistFromExtsMap: Record<string, string> = invert(inaturalistToExtsMap)

export function makePhotoCode(imageUrl: string): string {
	let result: URLPatternResult | null

	const exec = (input: string): URLPatternResult | null => {
		const pattern: URLPattern = new URLPattern(input)
		return pattern.exec(imageUrl)
	}

	const getPathnameGroups = (result: URLPatternResult): Record<string, string> => {
		return result.pathname.groups as Record<string, string>
	}

	result = exec('https://upload.wikimedia.org/wikipedia/commons/thumb/:_/*/*px-*.*')
	if (result) {
		let { 0: val } = getPathnameGroups(result)
		return `/${val}`
	}

	result = exec('https://upload.wikimedia.org/wikipedia/*')
	if (result) {
		let { 0: val } = getPathnameGroups(result)
		return `/@${val}`
	}

	result = exec('https://live.staticflickr.com/*_m.jpg')
	if (result) {
		let { 0: val } = getPathnameGroups(result)
		val = val.replace(/^65535\//, '')
		return `@${val}`
	}

	result = exec('https://i.imgur.com/:val.jpeg')
	if (result) {
		let { val } = getPathnameGroups(result)
		return `-${val}`
	}

	result = exec('https://i.imgur.com/:val.png')
	if (result) {
		let { val } = getPathnameGroups(result)
		return `-${val}`
	}

	result = exec('https://i.imgur.com/*_d.webp')
	if (result) {
		let { 0: val } = getPathnameGroups(result)
		return `-${val}`
	}

	result = exec('https://inaturalist-open-data.s3.amazonaws.com/photos/:val/*.:ext')
	if (result) {
		let { val, ext } = getPathnameGroups(result)
		ext = inaturalistFromExtsMap[ext]
		return `::${val}${ext}`
	}

	result = exec('https://static.inaturalist.org/photos/:val/*.:ext')
	if (result) {
		let { val, ext } = getPathnameGroups(result)
		ext = inaturalistFromExtsMap[ext]
		return `:${val}${ext}`
	}

	result = exec('https://www.fishbase.se/images/species/:val.jpg')
	if (result) {
		let { val } = getPathnameGroups(result)
		val = lowerFirst(val)
		return `^${val}`
	}

	result = exec('https://fishbase.mnhn.fr/images/species/:val.jpg')
	if (result) {
		let { val } = getPathnameGroups(result)
		val = lowerFirst(val)
		return `^${val}`
	}

	result = exec('https://www.fishbase.se/tools/UploadPhoto/uploads/:val.jpg')
	if (result) {
		let { val } = getPathnameGroups(result)
		return `^^${val}`
	}

	result = exec('https://reptile-database.reptarium.cz/content/photo_rd_*-030000*_01.jpg')
	if (result) {
		let { 0: val, 1: num } = getPathnameGroups(result)
		return `$${val}@${num}`
	}

	result = exec('https://bugguide.net/images/:raw/:a/:b/:val.jpg')
	if (result) {
		let { raw, val } = getPathnameGroups(result)
		raw = raw ? 'r' : ''
		return `~${val}${raw}`
	}

	result = exec('https://*')
	if (result) {
		let val = imageUrl.replace('https://', '')
		return `//${val}`
	}

	return ''
}
