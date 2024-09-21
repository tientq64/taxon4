import { Photo } from './parse'

export const inaturalistToExtsMap: Record<string, string> = {
	'': 'jpg',
	e: 'jpeg',
	p: 'png',
	J: 'JPG',
	E: 'JPEG',
	P: 'PNG',
	u: ''
}

export const reeflifesurveyExtsMap: Record<string, string> = {
	j: 'jpg',
	J: 'JPG'
}

export const bugguideTypesMap: Record<string, string> = {
	'': 'cache',
	r: 'raw'
}

export type ParsePhotoCodeResult = Pick<Photo, 'url' | 'viewBox'>

export function parsePhotoCode(photoCode: string, isDev: boolean): ParsePhotoCodeResult {
	const char: string = photoCode[0]
	const vals: string[] = photoCode.substring(1).split('#')
	let val: string = vals[0]

	let url: string

	let viewBox: string | undefined = vals[1]

	if (isDev && viewBox === '') {
		throw Error('viewBox hình ảnh không được để trống.')
	}

	if (viewBox !== undefined) {
		const sides: string[] = viewBox.split(',').map((side) => {
			return side.endsWith('px') ? side : side + '%'
		})

		if (isDev && sides.length > 1) {
			if (sides.every((side) => side === sides[0])) {
				throw Error('Các giá trị cạnh trùng lặp.')
			}
			if (sides.length === 3) {
				if (sides[0] === sides[2]) {
					throw Error('Cạnh dưới trùng cạnh trên.')
				}
			}
			if (sides.length === 4) {
				if (sides[1] === sides[3]) {
					if (sides[0] === sides[2]) {
						throw Error('Cạnh dưới trùng cạnh trên, cạnh trái trùng cạnh phải.')
					}
					throw Error('Cạnh trái trùng cạnh phải.')
				}
			}
		}

		viewBox = `inset(${sides.join(' ')})`
	}

	const needLargePhoto: boolean = viewBox !== undefined

	switch (char) {
		case '-':
			url = `https://i.imgur.com/${val}m.png`
			break

		case '/':
			{
				switch (val[0]) {
					case '/':
						url = `https:/${val}`
						break
					case '@':
						val = val.substring(1)
						url = `https://upload.wikimedia.org/wikipedia/${val}`
						break
					case '~': {
						val = val.substring(1)
						const ext: string = val.split('.').at(-1)!
						url = `https://upload.wikimedia.org/wikipedia/en/thumb/~/${val}/480px-~.${ext}`
						break
					}
					default: {
						const letter: string = val[0]
						const ext: string = val.split('.').at(-1)!
						url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${letter}/${val}/480px-${letter}.${ext}`
						break
					}
				}
			}
			break

		case ':':
			{
				const matches = /^(:?)(\d+)([epJEPu]?)$/.exec(val)!
				const host: string = matches[1]
					? 'inaturalist-open-data.s3.amazonaws.com'
					: 'static.inaturalist.org'
				const size: string = needLargePhoto ? 'large' : 'medium'
				const ext: string = inaturalistToExtsMap[matches[3]]
				val = matches[2]
				url = `https://${host}/photos/${val}/${size}.${ext}`
			}
			break

		case '@':
			url = `https://live.staticflickr.com/${val}_e.jpg`
			break

		case '%':
			url = `https://www.biolib.cz/IMG/GAL/${val}.jpg`
			break

		case '~':
			{
				const matches = /^([A-Z\d]+)([r]?)$/.exec(val)!
				const name: string = matches[1]
				const nameA: string = name.substring(0, 3)
				const nameB: string = name.substring(3, 6)
				const type: string = bugguideTypesMap[matches[2]]
				url = `https://bugguide.net/images/${type}/${nameA}/${nameB}/${name}.jpg`
			}
			break

		case '^':
			let path: string = 'images/species'
			if (val[0] === '^') {
				path = 'tools/uploadphoto/uploads'
				val = val.substring(1)
			}
			url = `https://d1iraxgbwuhpbw.cloudfront.net/${path}/${val}.jpg`
			break

		case '+':
			url = `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${val}/640`
			break

		case '$':
			val = val.replace('@', '-030000')
			url = `https://reptile-database.reptarium.cz/content/photo_rd_${val}_01.jpg`
			break

		case '<':
			url = `https://www.fishwisepro.com/pics/JPG/${val}.jpg`
			break

		case '>':
			const [node, name]: string[] = val.split('/')
			url = `https://biogeodb.stri.si.edu/${node}/resources/img/images/species/${name}.jpg`
			break

		case '=':
			url = `https://cdn.jsdelivr.net/gh/tientq64/taimg/${val}.webp`
			break

		case '!':
			url = `https://i.pinimg.com/564x/${val}.jpg`
			break

		case '&':
			url = `https://images.marinespecies.org/thumbs/${val}.jpg?w=320`
			break

		case '*':
			const ext: string = reeflifesurveyExtsMap[val.at(-1)!]
			val = val.slice(0, -1)
			url = `https://images.reeflifesurvey.com/0/species_${val}.w400.h266.${ext}`
			break

		default:
			url = char + val
			break
	}

	return { url, viewBox }
}
