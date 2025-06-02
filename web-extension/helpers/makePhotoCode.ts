import { findKey, invert } from 'lodash-es'
import {
	bugguideToTypesMap,
	inaturalistToExtsMap,
	reeflifesurveyToExtsMap
} from '../../src/helpers/parsePhotoCode'
import { lowerFirst } from '../../src/utils/lowerFirst'

export const inaturalistFromExtsMap: Record<string, string> = invert(inaturalistToExtsMap)
export const reeflifesurveyFromExtsMap: Record<string, string> = invert(reeflifesurveyToExtsMap)

export function makePhotoCode(imageUrl: string): string {
	let result: RegExpExecArray | null

	const exec = (regex: RegExp): RegExpExecArray | null => {
		return regex.exec(imageUrl)
	}

	result = exec(
		/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/\w\/(.+?)\/\d+px-.+?\.\w+(\?\d+)?$/
	)
	if (result) {
		const [, val] = result
		return `/${val}`
	}

	result = exec(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/\w\/(.+?\.\w+)$/)
	if (result) {
		const [, val] = result
		return `/${val}`
	}

	result = exec(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/(.+)$/)
	if (result) {
		const [, val] = result
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
		const [, val] = result
		return `-${val}`
	}

	result = exec(
		/^https:\/\/inaturalist-open-data\.s3\.amazonaws\.com\/photos\/(\d+)\/(?:\w+)\.(\w+)$/
	)
	if (result) {
		// eslint-disable-next-line prefer-const
		let [, val, ext] = result
		ext = inaturalistFromExtsMap[ext]
		return `::${val}${ext}`
	}

	result = exec(/^https:\/\/static\.inaturalist\.org\/photos\/(\d+)\/(?:\w+)\.(\w+)$/)
	if (result) {
		// eslint-disable-next-line prefer-const
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

	result = exec(
		/^https:\/\/(?:www\.)?fishbase\.(?:mnhn\.)?(?:se|fr)\/images\/thumbnails\/jpg\/tn_(.+?)\.jpg$/
	)
	if (result) {
		let [, val] = result
		val = lowerFirst(val)
		return `^${val}`
	}

	result = exec(/^https:\/\/www\.fishbase\.se\/tools\/UploadPhoto\/uploads\/(.+?)\.jpg$/)
	if (result) {
		const [, val] = result
		return `^^${val}`
	}

	result = exec(
		/^https:\/\/reptile-database\.reptarium\.cz\/content\/photo_rd_(.+?)-030000(\d+)_01\.jpg$/
	)
	if (result) {
		const [, val, num] = result
		return `$${val}@${num}`
	}

	result = exec(/^https:\/\/bugguide\.net\/images\/(raw|cache)\/\w+\/\w+\/(\w+)\.jpg$/)
	if (result) {
		// eslint-disable-next-line prefer-const
		let [, type, val] = result
		type = findKey(bugguideToTypesMap, (val) => val === type) ?? ''
		return `~${val}${type}`
	}

	result = exec(
		/^https:\/\/biogeodb\.stri\.si\.edu\/(\w+)\/resources\/img\/images\/species\/(\w+)\.jpg$/
	)
	if (result) {
		const [, node, val] = result
		return `>${node}/${val}`
	}

	result = exec(
		/^https:\/\/images\.reeflifesurvey\.com\/0\/species_(\w+)\.w\d+\.h\d+\.(jpg|JPG)$/
	)
	if (result) {
		// eslint-disable-next-line prefer-const
		let [, val, ext] = result
		ext = reeflifesurveyFromExtsMap[ext]
		return `*${val}${ext}`
	}

	result = exec(/^https:\/\/i\.pinimg\.com\/\d{3}x\/[\da-z/]{8}\/([\da-z]+)\.jpg$/)
	if (result) {
		const [, val] = result
		return `!${val}`
	}

	result = exec(
		/^https:\/\/cdn\.download\.ams\.birds\.cornell\.edu\/api\/v[12]\/asset\/(\d+)\/\d+$/
	)
	if (result) {
		const [, val] = result
		return `+${val}`
	}

	result = exec(/^https:\/\/i\.ibb\.co\/([\w-]+)\/i\.[a-zA-Z\d]{3,5}$/)
	if (result) {
		const [, val] = result
		return `.${val}`
	}

	result = exec(/^https:\/\/(.+)$/)
	if (result) {
		const [, val] = result
		return `//${val}`
	}

	return ''
}
