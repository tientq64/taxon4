import { PhotoSource, photoSourcesMap } from '../constants/photoSources'
import { Photo } from './parse'
import { parsePhotoSides } from './parsePhotoSides'

export const inaturalistToExtsMap: Record<string, string> = {
	'': 'jpg',
	e: 'jpeg',
	p: 'png',
	J: 'JPG',
	E: 'JPEG',
	P: 'PNG',
	u: ''
}

export const reeflifesurveyToExtsMap: Record<string, string> = {
	j: 'jpg',
	J: 'JPG'
}

export const bugguideToTypesMap: Record<string, string> = {
	'': 'cache',
	r: 'raw'
}

export type ParsePhotoCodeResult = Pick<Photo, 'url' | 'source' | 'viewBox'>

export function parsePhotoCode(
	photoCode: string,
	developerModeEnabled: boolean
): ParsePhotoCodeResult {
	const char = photoCode[0]
	const vals = photoCode.substring(1).split('#')
	let val = vals[0]

	let url: string
	let source: PhotoSource
	let viewBox: string | undefined = vals.at(1)

	const sides = parsePhotoSides(viewBox, developerModeEnabled)
	if (sides.length > 0) {
		viewBox = sides.map((side) => side + '%').join(' ')
		viewBox = `inset(${viewBox})`
	}
	const needLargeSize = sides.some((side) => side > 15)

	switch (char) {
		case '-':
			{
				const size = needLargeSize ? 'h' : 'l'
				url = `https://i.imgur.com/${val}${size}.png`
				source = photoSourcesMap.imgur
			}
			break

		case '/':
			{
				switch (val[0]) {
					case '/':
						url = `https:/${val}`
						source = photoSourcesMap.other
						break
					case '@':
						val = val.substring(1)
						url = `https://upload.wikimedia.org/wikipedia/${val}`
						source = photoSourcesMap.wikipedia
						break
					case '~': {
						val = val.substring(1)
						const ext = val.split('.').at(-1)!
						url = `https://upload.wikimedia.org/wikipedia/en/thumb/~/${val}/500px-~.${ext}`
						source = photoSourcesMap.wikipedia
						break
					}
					default: {
						const letter = val[0]
						const name = val.slice(3)
						url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${letter}/${val}/500px-${name}`
						source = photoSourcesMap.wikipedia
						break
					}
				}
			}
			break

		case ':':
			{
				const matches = /^(:?)(\d+)([epJEPu]?)$/.exec(val)!
				const host = matches[1]
					? 'inaturalist-open-data.s3.amazonaws.com'
					: 'static.inaturalist.org'
				const size = needLargeSize ? 'large' : 'medium'
				const ext = inaturalistToExtsMap[matches[3]]
				val = matches[2]
				url = `https://${host}/photos/${val}/${size}.${ext}`
				source = photoSourcesMap.inaturalist
			}
			break

		case '@':
			{
				if (!val.includes('/')) {
					val = `65535/${val}`
				}
				const size = needLargeSize ? 'c' : 'z'
				url = `https://live.staticflickr.com/${val}_${size}.jpg`
				source = photoSourcesMap.flickr
			}
			break

		case '%':
			url = `https://www.biolib.cz/IMG/GAL/${val}.jpg`
			source = photoSourcesMap.biolib
			break

		case '~':
			{
				const matches = /^([A-Z\d]+)([r]?)$/.exec(val)!
				const name = matches[1]
				const subnameA = name.substring(0, 3)
				const subnameB = name.substring(3, 6)
				const type = bugguideToTypesMap[matches[2]]
				url = `https://bugguide.net/images/${type}/${subnameA}/${subnameB}/${name}.jpg`
				source = photoSourcesMap.bugguide
			}
			break

		case '^':
			{
				let path = 'images/species'
				if (val[0] === '^') {
					path = 'tools/uploadphoto/uploads'
					val = val.substring(1)
				}
				url = `https://d1iraxgbwuhpbw.cloudfront.net/${path}/${val}.jpg`
				source = photoSourcesMap.fishbase
			}
			break

		case '+':
			url = `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${val}/640`
			source = photoSourcesMap.ebird
			break

		case '$':
			val = val.replace('@', '-030000')
			url = `https://reptile-database.reptarium.cz/content/photo_rd_${val}_01.jpg`
			source = photoSourcesMap.reptileDatabase
			break

		case '<':
			url = `https://www.fishwisepro.com/pics/JPG/${val}.jpg`
			source = photoSourcesMap.fishwisePro
			break

		case '>':
			{
				const [node, name] = val.split('/')
				url = `https://biogeodb.stri.si.edu/${node}/resources/img/images/species/${name}.jpg`
				source = photoSourcesMap.shorefishes
			}
			break

		case '=':
			url = `https://cdn.jsdelivr.net/gh/tientq64/taimg/${val}.webp`
			source = photoSourcesMap.github
			break

		case '!':
			{
				const dirA = val.slice(0, 2)
				const dirB = val.slice(2, 4)
				const dirC = val.slice(4, 6)
				url = `https://i.pinimg.com/564x/${dirA}/${dirB}/${dirC}/${val}.jpg`
				source = photoSourcesMap.pinterest
			}
			break

		case '&':
			url = `https://images.marinespecies.org/thumbs/${val}.jpg?w=320`
			source = photoSourcesMap.worms
			break

		case '*':
			{
				let num = '0'
				if (val[0] === '*') {
					val = val.slice(1)
					num = '1'
				}
				const ext = reeflifesurveyToExtsMap[val.at(-1)!]
				const size = needLargeSize ? 'w1000.h666' : 'w400.h266'
				val = val.slice(0, -1)
				url = `https://images.reeflifesurvey.com/${num}/species_${val}.${size}.${ext}`
				source = photoSourcesMap.reefLifeSurvey
			}
			break

		case '.':
			url = `https://i.ibb.co/${val}/i.jpg`
			source = photoSourcesMap.imgbb
			break

		default:
			url = char + val
			source = photoSourcesMap.other
			break
	}

	return { url, source, viewBox }
}
