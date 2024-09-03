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

export function parsePhotoCode(photoCode: string): string {
	const char: string = photoCode[0]
	let val: string = photoCode.substring(1)

	switch (char) {
		case '-':
			return `https://i.imgur.com/${val}m.png`

		case '/':
			switch (val[0]) {
				case '/':
					return `https:${val}.jpg`
				case '~': {
					val = val.substring(1)
					const ext: string = val.split('.').at(-1)!
					return `https://upload.wikimedia.org/wikipedia/en/thumb/~/${val}/320px-~.${ext}`
				}
				default: {
					const letter: string = val[0]
					const ext: string = val.split('.').at(-1)!
					return `https://upload.wikimedia.org/wikipedia/commons/thumb/${letter}/${val}/320px-${letter}.${ext}`
				}
			}

		case ':': {
			const matches = /^(:?)(\d+)([epJEPu]?)$/.exec(val)!
			const host: string = matches[1]
				? 'inaturalist-open-data.s3.amazonaws.com'
				: 'static.inaturalist.org'
			const ext: string = inaturalistToExtsMap[matches[3]]
			val = matches[2]
			return `https://${host}/photos/${val}/medium.${ext}`
		}

		case '@':
			return `https://live.staticflickr.com/${val}_e.jpg`

		case '%':
			return `https://www.biolib.cz/IMG/GAL/${val}.jpg`

		case '~': {
			const matches = /^([A-Z\d]+)([r]?)$/.exec(val)!
			const name: string = matches[1]
			const nameA: string = name.substring(0, 3)
			const nameB: string = name.substring(3, 6)
			const type: string = bugguideTypesMap[matches[2]]
			return `https://bugguide.net/images/${type}/${nameA}/${nameB}/${name}.jpg`
		}

		case '^':
			let path: string = 'images/species'
			if (val[0] === '^') {
				path = 'tools/uploadphoto/uploads'
				val = val.substring(1)
			}
			return `https://d1iraxgbwuhpbw.cloudfront.net/${path}/${val}.jpg`

		case '+':
			return `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${val}/320`

		case '$':
			return `https://reptile-database.reptarium.cz/content/photo_${val}.jpg`

		case '<':
			return `https://www.fishwisepro.com/pics/JPG/${val}.jpg`

		case '>':
			const [node, name]: string[] = val.split('/')
			return `https://biogeodb.stri.si.edu/${node}/resources/img/images/species/${name}.jpg`

		case '=':
			return `https://cdn.jsdelivr.net/gh/tientq64/taimg/${val}.webp`

		case '!':
			return `https://i.pinimg.com/564x/${val}.jpg`

		case '&':
			return `https://images.marinespecies.org/thumbs/${val}.jpg?w=320`

		case '*':
			const ext: string = reeflifesurveyExtsMap[val.at(-1)!]
			val = val.slice(0, -1)
			return `https://images.reeflifesurvey.com/0/species_${val}.w400.h266.${ext}`

		default:
			return char + val
	}
}
