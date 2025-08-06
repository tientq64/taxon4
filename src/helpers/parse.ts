import { ParseError } from '../constants/ParseError'
import { PhotoSource } from '../constants/photoSources'
import { Rank, Ranks } from '../constants/ranks'
import { parsePhotoCode } from './parsePhotoCode'

/** Một hình ảnh của một loài hoặc cấp dưới loài. */
export interface Photo {
	/** URL của hình ảnh. */
	url: string

	/** Thông tin về nguồn của bức ảnh này. */
	source: PhotoSource

	/** Cắt bớt các cạnh của hình ảnh khi xem. Sử dụng giá trị CSS `object-view-box`. */
	viewBox?: string

	/**
	 * Một (vài) từ ngắn gọn giải thích hình ảnh khi cần thiết. Ví dụ: "fossil",
	 * "restoration", "juvenile", "mandible", vv.
	 */
	caption?: string
}

/** Một đơn vị phân loại. */
export interface Taxon {
	index: number
	name: string
	rank: Rank

	/** Là sinh vật này đã tuyệt chủng? */
	extinct: boolean

	/**
	 * Là sinh vật nhân sơ có đặc điểm rõ ràng nhưng chưa được nuôi cấy?
	 *
	 * @see https://en.wikipedia.org/wiki/Candidatus
	 */
	candidatus: boolean

	/** Tên tiếng Anh của đơn vị phân loại này. */
	textEn?: string

	/** Tên tiếng Việt của đơn vị phân loại này. */
	textVi?: string

	/**
	 * Các hình ảnh. Là một mảng gồm 2 cấp. Cấp đầu tiên nhóm các ảnh theo giới tính, cấp
	 * thứ hai chứa hình ảnh. Nếu giới tính đó không có hình ảnh, giá trị sẽ là
	 * `undefined`.
	 *
	 * Phần tử đầu tiên là giống đực, thứ hai là giống cái, thứ ba là cả đực và cái nếu đã
	 * có ảnh giống đực hoặc cái.
	 */
	genderPhotos?: Photo[][]

	/**
	 * Văn bản định hướng cho link Wikipedia tiếng Anh.
	 *
	 * @see https://vi.wikipedia.org/wiki/Wikipedia:Định_hướng
	 */
	disambEn?: string

	/**
	 * Văn bản định hướng cho link Wikipedia tiếng Việt.
	 *
	 * @see https://vi.wikipedia.org/wiki/Wikipedia:Định_hướng
	 */
	disambVi?: string

	/**
	 * Id hình ảnh của icon trên [Flaticon][1].
	 *
	 * Ví dụ URL ảnh là https://cdn-icons-png.flaticon.com/256/5330/5330052.png thì id là
	 * `5330052`.
	 *
	 * [1]: https://www.flaticon.com/
	 */
	icon?: string

	/**
	 * Đánh dấu đơn vị phân loại này có tên thông thường trùng với tên đơn vị phân loại
	 * khác, không nên thêm tên cho nó nữa, hoặc nếu có thì phải xác nhận lại thật kỹ
	 * lưỡng trước khi thêm.
	 */
	noCommonName: boolean

	/**
	 * Tổng số dòng dữ liệu trong file dữ liệu của đơn vị phân loại này. Khi giá trị này
	 * khác `undefined` và lớn hơn 0, có nghĩa là đơn vị phân loại này có file dữ liệu
	 * trong thư mục "data/parts".
	 */
	dataPartFileLineCount?: number

	/** Đơn vị phân loại cha của đơn vị phân loại này. */
	parent?: Taxon

	/**
	 * Các đơn vị phân loại con của đơn vị phân loại này. Nếu không có, giá trị là
	 * `undefined`.
	 */
	children?: Taxon[]
}

const EMPTY_ARRAY: never[] = []

export function parse(data: string, fileLineCount: number, checkSyntax: boolean): Taxon[] {
	const lines: string[] = data.split('\n')
	const lineRegex = /^(\t*)(.+?)(?: - (.+?))?(?: \| (.+?))?(?: {{\+(\d+)}})?$/
	const namesTextRegex = /^(.+?)(~?)(\*?)(?: ([\\/].*?))?(?: \|([a-z\d\-]+?))?( !)?$/

	let index: number = 0
	let parent: Taxon = {
		index,
		name: 'Life',
		rank: Ranks[0],
		extinct: false,
		candidatus: false,
		textEn: 'Life',
		textVi: 'Sự sống',
		disambVi: '/Sự_sống',
		icon: '3419137',
		noCommonName: false,
		dataPartFileLineCount: fileLineCount
	}
	const taxa: Taxon[] = [parent]
	let prevTaxon: Taxon = parent
	let ancestorStack: Taxon[] = []
	index++

	for (const line of lines) {
		const makeParseError = (message: string): ParseError => {
			return new ParseError(message, line, index)
		}

		const segments = lineRegex.exec(line)
		if (segments === null) {
			throw makeParseError('Dữ liệu không hợp lệ')
		}

		const level: number = segments[1].length + 1
		const rank: Rank = Ranks[level]

		if (level > prevTaxon.rank.level) {
			parent = prevTaxon
			ancestorStack.push(parent)
		} else if (level < prevTaxon.rank.level) {
			if (checkSyntax) {
				const hasAncestorLevel: boolean = ancestorStack.some((ancestor) => {
					return ancestor.rank.level === level
				})
				if (!hasAncestorLevel) {
					throw makeParseError('Thụt lề không hợp lệ.')
				}
			}
			ancestorStack = ancestorStack.filter((ancestor) => ancestor.rank.level < level)
			parent = ancestorStack.at(-1)!
		}

		// if (checkSyntax) {
		// 	if (level > RanksMap.species.level) {
		// 		const hasParentIsSpecies: boolean = parents.some(
		// 			(ancestor) => ancestor.rank.level === RanksMap.species.level
		// 		)
		// 		if (!hasParentIsSpecies) {
		// 			throw makeParseError('Bậc nhỏ hơn loài phải có tổ tiên có bậc loài.')
		// 		}
		// 	}
		// }

		const namesText: string = segments[2]
		const textsText: string | undefined = segments[3]
		const photosText: string | undefined = segments[4]
		const dataPartFileLineCountText: string | undefined = segments[5]

		const matches = namesTextRegex.exec(namesText)
		if (matches === null) {
			throw makeParseError('Dữ liệu đoạn đầu không hợp lệ')
		}

		let name: string = matches[1]
		if (name.includes('\xd7')) {
			name = name.replace(/(?<=^| )x(?= )/g, '\xd7')
		}

		let candidatus: boolean = Boolean(matches[2])
		if (checkSyntax) {
			if (candidatus && parent.candidatus) {
				throw makeParseError('Đánh dấu candidatus trong mục cha đã là candidatus.')
			}
		}
		candidatus ||= parent.candidatus

		let extinct: boolean = Boolean(matches[3])
		if (checkSyntax) {
			if (extinct && parent.extinct) {
				throw makeParseError('Đánh dấu tuyệt chủng trong mục cha đã tuyệt chủng.')
			}
		}
		extinct ||= parent.extinct

		const disamb: string | undefined = matches[4]
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

		const icon: string | undefined = matches[5]
		// if (checkSyntax) {
		// 	if (icon !== undefined && isNaN(Number(icon))) {
		// 		throw makeParseError('Icon không phải là kiểu số.')
		// 	}
		// }

		const noCommonName: boolean = Boolean(matches[6])

		let textEn: string | undefined
		let textVi: string | undefined
		if (textsText) {
			const texts: string[] = textsText.split(/ \/ |^\/ /)
			if (texts[0]) {
				textEn = texts[0]
				if (checkSyntax) {
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
		}

		let genderPhotos: Photo[][] = []
		if (photosText) {
			const genderPhotosTexts: string[] = photosText.split(' / ')
			if (checkSyntax) {
				if (genderPhotosTexts.length > 3) {
					throw makeParseError('Có nhiều hơn 3 giới tính trong mục ảnh.')
				}
			}
			genderPhotos = genderPhotosTexts.map((genderPhotosText) => {
				if (genderPhotosText === '?') {
					return EMPTY_ARRAY
				}
				const photos: Photo[] = []
				const parts = genderPhotosText.split(' ; ')
				for (let i = 0; i < parts.length; i += 2) {
					try {
						const { url, source, viewBox } = parsePhotoCode(parts[i], checkSyntax)
						const caption: string | undefined = parts[i + 1]
						const photo: Photo = { url, source }
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

		let dataPartFileLineCount: number | undefined
		if (dataPartFileLineCountText) {
			dataPartFileLineCount = Number(dataPartFileLineCountText)
		}

		const taxon: Taxon = {
			index,
			name,
			rank,
			extinct,
			candidatus,
			textEn,
			textVi,
			disambEn,
			disambVi,
			icon,
			noCommonName,
			dataPartFileLineCount,
			parent
		}
		parent.children ??= []
		parent.children.push(taxon)

		if (genderPhotos.length > 0) {
			taxon.genderPhotos = genderPhotos
		}
		taxa.push(taxon)

		prevTaxon = taxon
		index++
	}

	return taxa
}
