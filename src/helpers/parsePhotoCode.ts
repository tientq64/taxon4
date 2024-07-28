export const inaturalistToExtsMap: Record<string, string> = {
	'': 'jpg',
	e: 'jpeg',
	p: 'png',
	J: 'JPG',
	E: 'JPEG',
	P: 'PNG',
	u: ''
}

export function parsePhotoCode(photoCode: string): string {
	const char: string = photoCode[0]
	let val: string = photoCode.substring(1)

	switch (char) {
		case '+':
			return `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${val}/320`

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

		case '-':
			return `https://i.imgur.com/${val}m.png`

		case '@':
			return `https://live.staticflickr.com/${val}_e.jpg`

		case ':': {
			const matches = /^(:?)(\d+)([epJEPu]?)$/.exec(val)!
			const host: string = matches[1]
				? 'inaturalist-open-data.s3.amazonaws.com'
				: 'static.inaturalist.org'
			const ext: string = inaturalistToExtsMap[matches[3]]
			val = matches[2]
			return `https://${host}/photos/${val}/medium.${ext}`
		}

		case '=':
			return `https://cdn.jsdelivr.net/gh/tientq64/taimg/${val}.webp`

		case '%':
			return `https://www.biolib.cz/IMG/GAL/${val}.jpg`

		default:
			return val
	}
}
