import { Rank, Ranks, RanksMap } from '../../web-extension/models/Ranks'
import { ParseError } from '../models/ParseError'
import { parsePhotoCode } from './parsePhotoCode'

export type GenderPhoto = Photo[] | undefined

export type Photo = {
	url: string
	caption?: string
}

export type Taxon = {
	index: number
	name: string
	rank: Rank
	extinct: boolean
	textEn?: string
	textVi?: string
	genderPhotos?: GenderPhoto[]
	photoUrl?: string
	disambEn?: string
	disambVi?: string
	icon?: string
	noCommonName: boolean
	parent?: Taxon
	children?: Taxon[]
}

export function parse(data: string): Taxon[] {
	const lines: string[] = data.split('\n')
	const namesTextRegex: RegExp = /^(.+?)(\*?)(?: ([\\/].*?))?(?: \|([a-z\d\-]+?))?( !)?$/

	let index: number = 0
	let parent: Taxon = {
		index,
		name: 'Life',
		rank: Ranks[0],
		extinct: false,
		textEn: 'Life',
		textVi: 'Sự sống',
		noCommonName: false
	}
	const taxa: Taxon[] = [parent]
	let prevTaxon: Taxon = parent
	let parents: Taxon[] = []

	for (const line of lines) {
		const ln: number = index
		index++

		const makeParseError = (message: string): ParseError => {
			return new ParseError(message, line, ln)
		}

		const level: number = line.lastIndexOf('\t') + 2

		const rank: Rank = Ranks[level]

		if (level > prevTaxon.rank.level) {
			parent = prevTaxon
			parents.push(parent)
		} else if (level < prevTaxon.rank.level) {
			parents = parents.filter((ancestor) => ancestor.rank.level < level)
			parent = parents.at(-1)!
		}

		const text: string = line.substring(level - 1)
		const parts: string[] = text.split(/(?= - | \| )/)
		const namesText: string = parts[0]
		let textsText: string | undefined = parts[1]
		let photosText: string | undefined = parts[2]
		let textEn: string | undefined
		let textVi: string | undefined
		let genderPhotos: GenderPhoto[] | undefined
		let photoUrl: string | undefined
		const matches = namesTextRegex.exec(namesText)!

		const name: string = matches[1]

		let extinct: boolean = Boolean(matches[2])

		if (extinct && parent.extinct) {
			throw makeParseError('Đánh dấu tuyệt chủng trong mục cha đã tuyệt chủng.')
		}

		extinct ||= parent.extinct

		const disamb: string | undefined = matches[3]
		let disambEn: string | undefined
		let disambVi: string | undefined
		if (disamb) {
			const disambs: string[] = disamb.split(/(?=[\\/])/)

			disambEn = disambs[0]
			if (disambEn === '\\') {
				disambEn = undefined
			}

			disambVi = disambs[1]
		}

		const icon: string | undefined = matches[4]

		const noCommonName: boolean = Boolean(matches[5])

		if (textsText) {
			if (textsText.startsWith(' - ')) {
				const texts: string[] = textsText.substring(3).split(/ \/ |^\/ /)

				if (texts[0]) {
					textEn = texts[0]

					if (/[/]/.test(textEn)) {
						throw makeParseError('Tên tiếng Anh chứa ký tự không hợp lệ.')
					}
					if (noCommonName) {
						throw makeParseError('Mục này không được có tên tiếng Anh.')
					}
					if (textEn[0] !== textEn[0].toUpperCase()) {
						throw makeParseError('Tên tiếng Anh phải viết hoa chữ cái đầu.')
					}
				}

				if (texts[1]) {
					textVi = texts[1]
				}
			} else {
				photosText = textsText
				textsText = undefined
			}
		}

		if (photosText) {
			const genderPhotosTexts: string[] = photosText.substring(3).split(' / ')

			if (genderPhotosTexts.length > 3) {
				throw makeParseError('Có nhiều hơn 3 giới tính trong mục ảnh.')
			}

			genderPhotos = genderPhotosTexts.map((genderPhotosText) => {
				if (genderPhotosText === '?') return

				const photos: Photo[] = []
				const parts = genderPhotosText.split(' ; ')

				for (let i = 0; i < parts.length; i += 2) {
					const photo: Photo = {
						url: parsePhotoCode(parts[i]),
						caption: parts[i + 1]
					}
					if (photo.caption === '.') {
						delete photo.caption
					}
					photos.push(photo)
				}
				return photos
			})

			if (genderPhotos) {
				photoUrl = (genderPhotos[0] || genderPhotos[1])![0].url
			}
		}

		const taxon: Taxon = {
			index,
			name,
			rank,
			extinct,
			textEn,
			textVi,
			disambEn,
			disambVi,
			icon,
			noCommonName,
			parent
		}
		parent.children ??= []
		parent.children.push(taxon)

		if (level >= RanksMap.species.level) {
			taxon.genderPhotos = genderPhotos
			taxon.photoUrl = photoUrl
		}

		taxa.push(taxon)
		prevTaxon = taxon
	}

	return taxa
}
