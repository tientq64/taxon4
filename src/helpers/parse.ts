import { Rank, Ranks, RanksMap } from '../../web-extension/models/Ranks'
import { ParseError } from '../models/ParseError'
import { useStore } from '../store/useStore'
import { parsePhotoCode } from './parsePhotoCode'

export type Photo = {
	url: string
	caption?: string
	viewBox?: string
}

export type Taxon = {
	index: number
	name: string
	rank: Rank
	extinct: boolean
	textEn?: string
	textVi?: string
	genderPhotos?: Photo[][]
	disambEn?: string
	disambVi?: string
	icon?: string
	noCommonName: boolean
	parent?: Taxon
	children?: Taxon[]
}

export type NullableTaxon = Taxon | undefined

const EMPTY_ARRAY: never[] = []

export function parse(data: string): Taxon[] {
	const isDev = useStore.getState().isDev

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
		icon: '3419137',
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
			if (isDev) {
				const hasAncestorLevel: boolean = parents.some(
					(ancestor) => ancestor.rank.level === level
				)
				if (!hasAncestorLevel) {
					throw makeParseError('Thụt lề không hợp lệ.')
				}
			}

			parents = parents.filter((ancestor) => ancestor.rank.level < level)
			parent = parents.at(-1)!
		}

		if (isDev) {
			if (level > RanksMap.species.level) {
				const hasParentIsSpecies: boolean = parents.some(
					(ancestor) => ancestor.rank.level === RanksMap.species.level
				)
				if (!hasParentIsSpecies) {
					throw makeParseError('Bậc nhỏ hơn loài phải có tổ tiên có bậc loài.')
				}
			}
		}

		const text: string = line.substring(level - 1)
		const parts: string[] = text.split(/(?= - | \| )/)
		const namesText: string = parts[0]
		let textsText: string | undefined = parts[1]
		let photosText: string | undefined = parts[2]
		let textEn: string | undefined
		let textVi: string | undefined
		let genderPhotos: Photo[][] = []
		const matches = namesTextRegex.exec(namesText)!

		let name: string = matches[1]

		if (name.includes('\xd7')) {
			name = name.replace(/(?<=^| )x(?= )/g, '\xd7')
		}

		let extinct: boolean = Boolean(matches[2])

		if (isDev) {
			if (extinct && parent.extinct) {
				throw makeParseError('Đánh dấu tuyệt chủng trong mục cha đã tuyệt chủng.')
			}
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

		// if (isDev) {
		// 	if (icon !== undefined && isNaN(Number(icon))) {
		// 		throw makeParseError('Icon không phải là kiểu số.')
		// 	}
		// }

		const noCommonName: boolean = Boolean(matches[5])

		if (textsText) {
			if (textsText.startsWith(' - ')) {
				const texts: string[] = textsText.substring(3).split(/ \/ |^\/ /)

				if (texts[0]) {
					textEn = texts[0]

					if (isDev) {
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

			if (isDev) {
				if (genderPhotosTexts.length > 3) {
					throw makeParseError('Có nhiều hơn 3 giới tính trong mục ảnh.')
				}
			}

			genderPhotos = genderPhotosTexts.map((genderPhotosText) => {
				if (genderPhotosText === '?') return EMPTY_ARRAY

				const photos: Photo[] = []
				const parts = genderPhotosText.split(' ; ')

				for (let i = 0; i < parts.length; i += 2) {
					try {
						const { url, viewBox } = parsePhotoCode(parts[i])
						const caption: string | undefined = parts[i + 1]

						const photo: Photo = { url }

						if (caption !== undefined && caption !== '.') {
							photo.caption = caption
						}
						if (viewBox !== undefined) {
							photo.viewBox = viewBox
						}
						photos.push(photo)
					} catch (error: unknown) {
						if (error instanceof Error) {
							throw makeParseError(error.message)
						}
						throw error
					}
				}
				return photos
			})
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

		if (genderPhotos.length > 0) {
			taxon.genderPhotos = genderPhotos
		}

		taxa.push(taxon)
		prevTaxon = taxon
	}

	return taxa
}
