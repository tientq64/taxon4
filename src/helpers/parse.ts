import { Rank, ranks, ranksMap } from '../../web-extension/helpers/ranks'
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
	top: number
	bottom: number
	subIndex?: number
}

export function parse(data: string): Taxon[] {
	const lines: string[] = data.split('\n')
	const namesTextRegex: RegExp = /^(.+?)(\*?)(?: ([\\/].*?))?(?: \|([a-z\d\-]+?))?( !)?$/

	let parent: Taxon = {
		index: 0,
		name: 'Life',
		rank: ranks[0],
		extinct: false,
		textEn: 'Life',
		textVi: 'Sự sống',
		noCommonName: false,
		top: 0,
		bottom: 24
	}
	let stack: Taxon[] = []
	const taxa: Taxon[] = [parent]
	let prevTaxon: Taxon = parent
	let top: number = 24
	let taxaRow: Taxon[] = []
	let taxaRowHeight: number = 120
	let subIndex: number = 0

	for (let index = 0; index < lines.length; index++) {
		const line: string = lines[index]
		const level: number = line.lastIndexOf('\t') + 2
		const rank: Rank = ranks[level]

		if (level > prevTaxon.rank.level) {
			parent = prevTaxon
			stack.push(parent)
		} else if (level < prevTaxon.rank.level) {
			stack = stack.filter((taxon2) => taxon2.rank.level < level)
			parent = stack[stack.length - 1]
		}

		if (level < ranksMap.species.level) {
			if (taxaRow.length) {
				top += taxaRowHeight
			}
		}

		const text: string = line.substring(level - 1)
		const parts: string[] = text.split(/(?= - | \| )/)
		const namesText: string = parts[0]
		let textsText: string | undefined = parts[1]
		let photosText: string | undefined = parts[2]
		let textEn: string | undefined
		let textVi: string | undefined
		let genderPhotos: GenderPhoto[] | undefined = undefined
		let photoUrl: string | undefined = undefined

		const matches = namesTextRegex.exec(namesText)!
		const name: string = matches[1]
		const extinct: boolean = parent.extinct || Boolean(matches[2])
		const disamb: string | undefined = matches[3]
		let disambEn: string | undefined = undefined
		let disambVi: string | undefined = undefined
		if (disamb) {
			;[disambEn, disambVi] = disamb.split(/(?=[\\/])/)
			if (disambEn === '\\') disambEn = undefined
		}
		const icon: string | undefined = matches[4]
		const noCommonName: boolean = Boolean(matches[5])
		if (textsText) {
			if (textsText.startsWith(' - ')) {
				;[textEn, textVi] = textsText.substring(3).split(/ \/ |^\/ /)
			} else {
				photosText = textsText
				textsText = undefined
			}
		}
		if (photosText) {
			genderPhotos = photosText
				.substring(3)
				.split(' / ')
				.map((genderPhotosText) => {
					if (genderPhotosText === '?') return
					const photos: Photo[] = []
					const parts = genderPhotosText.split(' ; ')
					for (let i = 0; i < parts.length; i += 2) {
						const photo: Photo = {
							url: parsePhotoCode(parts[i]),
							caption: parts[i + 1]
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
			parent,
			top,
			bottom: top + 24
		}
		parent.children ??= []
		parent.children.push(taxon)

		if (level >= ranksMap.species.level) {
			taxon.genderPhotos = genderPhotos
			taxon.photoUrl = photoUrl
			taxon.subIndex = subIndex
			if (textEn) {
				taxaRowHeight = 140
			}
			taxaRow.push(taxon)
			for (const taxonRow of taxaRow) {
				taxonRow.bottom = top + taxaRowHeight
			}
			if (taxaRow.length === 7) {
				top += taxaRowHeight
				taxaRow = []
				taxaRowHeight = 120
			}
			subIndex++
		} else {
			top += 24
			taxaRow = []
			taxaRowHeight = 120
			subIndex = 0
		}

		taxa.push(taxon)
		prevTaxon = taxon
	}

	return taxa
}
