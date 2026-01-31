/** Tên bậc phân loại. */
export const enum RankName {
	Life = 'life',
	Domain = 'domain',

	Kingdom = 'kingdom',
	Subkingdom = 'subkingdom',
	Infrakingdom = 'infrakingdom',

	Superphylum = 'superphylum',
	Phylum = 'phylum',
	Subphylum = 'subphylum',
	Infraphylum = 'infraphylum',
	Microphylum = 'microphylum',

	Superclass = 'superclass',
	Class = 'class',
	Subclass = 'subclass',
	Infraclass = 'infraclass',
	Parvclass = 'parvclass',

	Legion = 'legion',
	Supercohort = 'supercohort',
	Cohort = 'cohort',
	Subcohort = 'subcohort',

	Magnorder = 'magnorder',
	Superorder = 'superorder',
	Order = 'order',
	Suborder = 'suborder',
	Infraorder = 'infraorder',
	Parvorder = 'parvorder',

	Section = 'section',
	Subsection = 'subsection',
	Superfamily = 'superfamily',
	Family = 'family',
	Subfamily = 'subfamily',

	Supertribe = 'supertribe',
	Tribe = 'tribe',
	Subtribe = 'subtribe',

	Genus = 'genus',
	Subgenus = 'subgenus',
	SectionBotany = 'sectionBotany',
	SubsectionBotany = 'subsectionBotany',
	Series = 'series',
	Subseries = 'subseries',

	Superspecies = 'superspecies',
	Species = 'species',

	Subspecies = 'subspecies',
	Variety = 'variety',
	Form = 'form'
}

/** Bậc phân loại. */
export interface Rank {
	/** Cấp bậc của bậc phân loại. Bắt đầu từ 0 (bậc Sự Sống). */
	level: number

	/** Tên bậc phân loại. */
	name: RankName

	/** Tên hiển thị của bậc phân loại bằng tiếng Anh. */
	textEn: string

	/** Tên hiển thị của bậc phân loại bằng tiếng Việt. */
	textVi: string

	/**
	 * Tên nhóm của bậc phân loại này. Các bậc phân loại được nhóm theo các nhóm liên quan
	 * với nhau. Việc nhóm này không phải quy chuẩn phân loại sinh học.
	 */
	groupName: string

	/** Class Tailwind CSS cho màu chữ của bậc phân loại này. */
	colorClass: string

	/** Regex dùng để tìm kiếm bậc phân loại này, gồm tiếng Anh và tiếng Việt. */
	regex?: RegExp

	/**
	 * Ký tự viết tắt của bậc phân loại này dùng trong tên khoa học khi cần thiết. Vd
	 * "var.", "sect.", nhưng không phải "ssp." vì tên phân loài không cần thiết phải chứa
	 * từ viết tắt đó.
	 */
	abbrPrefix?: string

	/**
	 * Các hậu tố dùng để phát hiện tên khoa học của đơn vị phân loại này. Lưu ý điều này
	 * đôi khi không chính xác, vì một số bậc phân loại có tên trùng với hậu tố của bậc
	 * phân loại khác, gây nhầm lẫn.
	 */
	nameSuffixes?: string[]

	/** Bậc phân loại chính thức. */
	isMain?: boolean
}

/** Đối tượng dùng để truy cập vào các rank khác nhau. */
export const RanksMap: Record<RankName, Rank> = {
	life: {
		level: 0,
		name: RankName.Life,
		textEn: 'Life',
		textVi: 'Sự sống',
		groupName: 'domain',
		colorClass: 'text-rose-400'
	},
	domain: {
		level: 1,
		name: RankName.Domain,
		textEn: 'Domain',
		textVi: 'Vực',
		groupName: 'domain',
		colorClass: 'text-rose-400',
		regex: /\b(domains?|superkingdoms?)\b|\b(vực|liên giới)\b/i,
		isMain: true
	},
	kingdom: {
		level: 2,
		name: RankName.Kingdom,
		textEn: 'Kingdom',
		textVi: 'Giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(kingdoms?)\b|\b(giới)\b/i,
		isMain: true
	},
	subkingdom: {
		level: 3,
		name: RankName.Subkingdom,
		textEn: 'Subkingdom',
		textVi: 'Phân giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(subkingdoms?)\b|\b(phân giới)\b/i
	},
	infrakingdom: {
		level: 4,
		name: RankName.Infrakingdom,
		textEn: 'Infrakingdom',
		textVi: 'Thứ giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(infrakingdoms?)\b|\b(thứ giới)\b/i
	},
	superphylum: {
		level: 5,
		name: RankName.Superphylum,
		textEn: 'Superphylum',
		textVi: 'Liên ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(superphylums?|superdivisions?)\b|\b(liên ngành)\b/i
	},
	phylum: {
		level: 6,
		name: RankName.Phylum,
		textEn: 'Phylum',
		textVi: 'Ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(phylums?|divisions?)\b|\b(ngành)\b/i,
		nameSuffixes: ['phyta', 'mycota'],
		isMain: true
	},
	subphylum: {
		level: 7,
		name: RankName.Subphylum,
		textEn: 'Subphylum',
		textVi: 'Phân ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(subphylums?|subdivisions?)\b|\b(phân ngành)\b/i,
		nameSuffixes: ['phytina', 'mycotina']
	},
	infraphylum: {
		level: 8,
		name: RankName.Infraphylum,
		textEn: 'Infraphylum',
		textVi: 'Thứ ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(infraphylums?)\b|\b(thứ ngành)\b/i
	},
	microphylum: {
		level: 9,
		name: RankName.Microphylum,
		textEn: 'Microphylum',
		textVi: 'Tiểu ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(microphylums?)\b|\b(tiểu ngành)\b/i
	},
	superclass: {
		level: 10,
		name: RankName.Superclass,
		textEn: 'Superclass',
		textVi: 'Liên lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(superclass(es)?)\b|\b(liên lớp)\b/i
	},
	class: {
		level: 11,
		name: RankName.Class,
		textEn: 'Class',
		textVi: 'Lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(class(es)?)\b|\b(lớp)\b/i,
		nameSuffixes: ['opsida', 'phyceae', 'mycetes'],
		isMain: true
	},
	subclass: {
		level: 12,
		name: RankName.Subclass,
		textEn: 'Subclass',
		textVi: 'Phân lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(subclass(es)?)\b|\b(phân lớp)\b/i,
		nameSuffixes: ['phycidae', 'mycetidae']
	},
	infraclass: {
		level: 13,
		name: RankName.Infraclass,
		textEn: 'Infraclass',
		textVi: 'Thứ lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(infraclass(es)?)\b|\b(thứ lớp)\b/i
	},
	parvclass: {
		level: 14,
		name: RankName.Parvclass,
		textEn: 'Parvclass',
		textVi: 'Tiểu lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(parvclass(es)?)\b|\b(tiểu lớp)\b/i
	},
	legion: {
		level: 15,
		name: RankName.Legion,
		textEn: 'Legion',
		textVi: 'Đoàn',
		groupName: 'cohort',
		colorClass: 'text-red-300',
		regex: /\b(legions?)\b|\B(đoàn)\b/i
	},
	supercohort: {
		level: 16,
		name: RankName.Supercohort,
		textEn: 'Supercohort',
		textVi: 'Liên đội',
		groupName: 'cohort',
		colorClass: 'text-red-300',
		regex: /\b(supercohorts?)\b|\b(liên đội)\b/i
	},
	cohort: {
		level: 17,
		name: RankName.Cohort,
		textEn: 'Cohort',
		textVi: 'Đội',
		groupName: 'cohort',
		colorClass: 'text-red-300',
		regex: /\b(cohorts?)\b|\B(đội)\b/i
	},
	subcohort: {
		level: 18,
		name: RankName.Subcohort,
		textEn: 'Subcohort',
		textVi: 'Phân đội',
		groupName: 'cohort',
		colorClass: 'text-red-300',
		regex: /\b(subcohorts?)\b|\B(phân đội)\b/i
	},
	magnorder: {
		level: 19,
		name: RankName.Magnorder,
		textEn: 'Magnorder',
		textVi: 'Tổng bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(magnorders?|megaorders?)\b|\b(tổng bộ)\B/i
	},
	superorder: {
		level: 20,
		name: RankName.Superorder,
		textEn: 'Superorder',
		textVi: 'Liên bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(superorders?)\b|\b(liên bộ)\B/i,
		nameSuffixes: ['anae']
	},
	order: {
		level: 21,
		name: RankName.Order,
		textEn: 'Order',
		textVi: 'Bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(orders?|ordines?)\b|\b(bộ)\B/i,
		nameSuffixes: ['ales'],
		isMain: true
	},
	suborder: {
		level: 22,
		name: RankName.Suborder,
		textEn: 'Suborder',
		textVi: 'Phân bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(suborders?)\b|\b(phân bộ)\B/i,
		nameSuffixes: ['ineae']
	},
	infraorder: {
		level: 23,
		name: RankName.Infraorder,
		textEn: 'Infraorder',
		textVi: 'Thứ bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(infraorders?)\b|\b(thứ bộ)\B/i,
		nameSuffixes: ['aria']
	},
	parvorder: {
		level: 24,
		name: RankName.Parvorder,
		textEn: 'Parvorder',
		textVi: 'Tiểu bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(parvorders?)\b|\b(tiểu bộ)\B/i
	},
	section: {
		level: 25,
		name: RankName.Section,
		textEn: 'Section',
		textVi: 'Đoạn',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(sections?)\b|\B(đoạn)\b/i
	},
	subsection: {
		level: 26,
		name: RankName.Subsection,
		textEn: 'Subsection',
		textVi: 'Phân đoạn',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(subsections?)\b|\b(phân đoạn)\b/i
	},
	superfamily: {
		level: 27,
		name: RankName.Superfamily,
		textEn: 'Superfamily',
		textVi: 'Liên họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(superfamil(y|ies)?)\b|\b(liên họ)\B/i,
		nameSuffixes: ['acea', 'oidea']
	},
	family: {
		level: 28,
		name: RankName.Family,
		textEn: 'Family',
		textVi: 'Họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(famil(y|ies)?)\b|\b(họ)\B/i,
		nameSuffixes: ['aceae', 'idae'],
		isMain: true
	},
	subfamily: {
		level: 29,
		name: RankName.Subfamily,
		textEn: 'Subfamily',
		textVi: 'Phân họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(subfamil(y|ies)?)\b|\b(phân họ)\B/i,
		nameSuffixes: ['oideae', 'inae']
	},
	supertribe: {
		level: 30,
		name: RankName.Supertribe,
		textEn: 'Supertribe',
		textVi: 'Liên tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(supertribes?)\b|\b(liên tông)\b/i
	},
	tribe: {
		level: 31,
		name: RankName.Tribe,
		textEn: 'Tribe',
		textVi: 'Tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(tribes?)\b|\b(tông)\b/i,
		nameSuffixes: ['eae', 'ini']
	},
	subtribe: {
		level: 32,
		name: RankName.Subtribe,
		textEn: 'Subtribe',
		textVi: 'Phân tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(subtribes?)\b|\b(phân tông)\b/i,
		// Không thêm "ina" vào danh sách, vì một vài chi cũng có tên kết thúc với "ina", dễ nhầm thành phân tông.
		nameSuffixes: ['inae']
	},
	genus: {
		level: 33,
		name: RankName.Genus,
		textEn: 'Genus',
		textVi: 'Chi',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(gen(us|era)?)\b|\b(chi)\b/i,
		isMain: true
	},
	subgenus: {
		level: 34,
		name: RankName.Subgenus,
		textEn: 'Subgenus',
		textVi: 'Phân chi',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(subgen(us|era)?)\b|\b(phân chi)\b/i
	},
	sectionBotany: {
		level: 35,
		name: RankName.SectionBotany,
		textEn: 'Section',
		textVi: 'Mục',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(sections?)\b|\b(mục)\b/i,
		abbrPrefix: 'sect.'
	},
	subsectionBotany: {
		level: 36,
		name: RankName.SubsectionBotany,
		textEn: 'Subsection',
		textVi: 'Phân mục',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(subsections?)\b|\b(phân mục)\b/i
	},
	series: {
		level: 37,
		name: RankName.Series,
		textEn: 'Series',
		textVi: 'Loạt',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(series)\b|\b(loạt)\b/i
	},
	subseries: {
		level: 38,
		name: RankName.Subseries,
		textEn: 'Subseries',
		textVi: 'Phân loạt',
		groupName: 'genus',
		colorClass: 'text-orange-200',
		regex: /\b(subseries)\b|\b(phân loạt)\b/i
	},
	superspecies: {
		level: 39,
		name: RankName.Superspecies,
		textEn: 'Superspecies',
		textVi: 'Liên loài',
		groupName: 'species',
		colorClass: 'text-white',
		regex: /\b(superspecies)\b|\b(liên loài)\b/i
	},
	species: {
		level: 40,
		name: RankName.Species,
		textEn: 'Species',
		textVi: 'Loài',
		groupName: 'species',
		colorClass: 'text-white',
		regex: /\b(species)\b|\b(loài)\b/i,
		isMain: true
	},
	subspecies: {
		level: 41,
		name: RankName.Subspecies,
		textEn: 'Subspecies',
		textVi: 'Phân loài',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(subspecies|strain)\b|\b(phân loài)\b/i
	},
	variety: {
		level: 42,
		name: RankName.Variety,
		textEn: 'Variety',
		textVi: 'Thứ',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(variet(y|ies)?)\b|\b(thứ)\B/i,
		abbrPrefix: 'var.'
	},
	form: {
		level: 43,
		name: RankName.Form,
		textEn: 'Form',
		textVi: 'Dạng',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(forms?)\b|\b(dạng)\b/i,
		abbrPrefix: 'f.'
	}
}

/** Danh sách các bậc phân loại. */
export const Ranks: Rank[] = Object.values(RanksMap).sort(
	(rankA, rankB) => rankA.level - rankB.level
)

/** Bậc phân loại nhỏ nhất (bậc form). */
export const lastRank: Rank = Ranks.at(-1)!

// Export một số bậc phân loại hay dùng.
export const { species, genus, subspecies, family } = RanksMap

/**
 * Cố gắng tìm bậc phân loại bằng các tên tương tự với tên chuẩn trong một đoạn văn bản
 * bất kỳ.
 *
 * @example
 * 	findRankBySimilarName('Phân họ') // Bậc subfamily
 * 	findRankBySimilarName('Subfamilies') // Bậc subfamily
 * 	findRankBySimilarName('The subfamiy') // Bậc subfamily
 * 	findRankBySimilarName('Subfami') // undefined
 *
 * @param similarName Tên bậc phân loại muốn tìm. Tên có thể gần giống với tên chuẩn.
 * @returns Bậc phân loại tìm thấy hoặc `undefined` nếu không tìm thấy.
 */
export function findRankBySimilarName(similarName: string): Rank | undefined {
	similarName = similarName.trim()
	for (const rank of Ranks) {
		if (rank.regex?.test(similarName)) {
			return rank
		}
	}
	return undefined
}

/**
 * Cố gắng đoán bậc phân loại dựa trên tên khoa học của đơn vị phân loại, nếu có thể.
 *
 * @example
 * 	findRankByTaxonName('Formicidae') // Bậc family
 * 	findRankByTaxonName('Stegastes') // undefined
 *
 * @param taxonName Tên khoa học của đơn vị phân loại.
 * @returns Bậc phân loại tìm thấy, hoặc `undefined` nếu không tìm thấy.
 */
export function findRankByTaxonName(taxonName: string): Rank | undefined {
	const nameSuffixAndRankPairs: [nameSuffix: string, rank: Rank][] = []
	for (const rank of Ranks) {
		if (rank.nameSuffixes === undefined) continue
		for (const nameSuffix of rank.nameSuffixes) {
			nameSuffixAndRankPairs.push([nameSuffix, rank])
		}
	}
	nameSuffixAndRankPairs.sort(([nameSuffixA], [nameSuffixB]) => {
		return nameSuffixB.length - nameSuffixA.length
	})
	for (const [nameSuffix, rank] of nameSuffixAndRankPairs) {
		if (taxonName.endsWith(nameSuffix)) {
			return rank
		}
	}
	return undefined
}
