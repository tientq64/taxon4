import { invert } from 'lodash-es'
import { inaturalistToExtsMap, reeflifesurveyToExtsMap } from '../../src/helpers/parsePhotoCode'
import { lowerFirst } from '../../src/utils/lowerFirst'

export const inaturalistFromExtsMap: Record<string, string> = invert(inaturalistToExtsMap)
export const reeflifesurveyFromExtsMap: Record<string, string> = invert(reeflifesurveyToExtsMap)

export function makePhotoCode(imageUrl: string): string {
	let result: RegExpExecArray | null

	const exec = (regex: RegExp): RegExpExecArray | null => {
		return regex.exec(imageUrl)
	}

	result = exec(
		/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/\w\/(.+?)\/\d+px-.+?\.\w+$/
	)
	if (result) {
		let [, val] = result
		return `/${val}`
	}

	result = exec(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/(.+)$/)
	if (result) {
		let [, val] = result
		return `/@${val}`
	}

	result = exec(/^https:\/\/live\.staticflickr\.com\/(.+?)_m\.jpg$/)
	if (result) {
		let [, val] = result
		val = val.replace(/^65535\//, '')
		return `@${val}`
	}

	result = exec(/^https:\/\/i\.imgur\.com\/([\w\-]+)(?:_d)?\.(?:jpeg|png|webp)$/)
	if (result) {
		let [, val] = result
		return `-${val}`
	}

	result = exec(
		/^https:\/\/inaturalist-open-data\.s3\.amazonaws\.com\/photos\/(\d+)\/(?:\w+)\.(\w+)$/
	)
	if (result) {
		let [, val, ext] = result
		ext = inaturalistFromExtsMap[ext]
		return `::${val}${ext}`
	}

	result = exec(/^https:\/\/static\.inaturalist\.org\/photos\/(\d+)\/(?:\w+)\.(\w+)$/)
	if (result) {
		let [, val, ext] = result
		ext = inaturalistFromExtsMap[ext]
		return `:${val}${ext}`
	}

	result = exec(
		/^https:\/\/(?:www\.)?fishbase\.(?:mnhn\.)?(?:se|fr)\/images\/species\/(\w+)\.jpg$/
	)
	if (result) {
		let [, val] = result
		val = lowerFirst(val)
		return `^${val}`
	}

	result = exec(/^https:\/\/www\.fishbase\.se\/tools\/UploadPhoto\/uploads\/(.+?)\.jpg$/)
	if (result) {
		let [, val] = result
		return `^^${val}`
	}

	result = exec(
		/^https:\/\/reptile-database\.reptarium\.cz\/content\/photo_rd_(.+?)-030000(\d+)_01\.jpg$/
	)
	if (result) {
		let [, val, num] = result
		return `$${val}@${num}`
	}

	result = exec(/^https:\/\/bugguide\.net\/images\/(raw|cache)\/\w+\/\w+\/(\w+)\.jpg$/)
	if (result) {
		let [, raw, val] = result
		raw = raw ? 'r' : ''
		return `~${val}${raw}`
	}

	result = exec(
		/^https:\/\/biogeodb\.stri\.si\.edu\/(\w+)\/resources\/img\/images\/species\/(\w+)\.jpg$/
	)
	if (result) {
		let [, node, val] = result
		return `>${node}/${val}`
	}

	result = exec(
		/^https:\/\/images\.reeflifesurvey\.com\/0\/species_(\w+)\.w\d+\.h\d+\.(jpg|JPG)$/
	)
	if (result) {
		let [, val, ext] = result
		ext = reeflifesurveyFromExtsMap[ext]
		return `*${val}${ext}`
	}

	result = exec(/^https:\/\/(.+)$/)
	if (result) {
		let [, val] = result
		return `//${val}`
	}

	return ''
}
