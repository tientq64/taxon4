import { Taxon } from '../../src/helpers/parse'

export type Rank = {
	level: number
	name: string
	textEn: string
	textVi: string
	groupName: string
	colorClass: string
	regex?: RegExp
	abbrPrefix?: string
}

/**
 * Đối tượng dùng để truy cập vào các rank khác nhau.
 */
export const RanksMap = {
	life: {
		level: 0,
		name: 'life',
		textEn: 'Life',
		textVi: 'Sự sống',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300'
	},
	domain: {
		level: 1,
		name: 'domain',
		textEn: 'Domain',
		textVi: 'Vực',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(domains?|superkingdoms?)\b|\b(vực|liên giới)\b/i
	},
	kingdom: {
		level: 2,
		name: 'kingdom',
		textEn: 'Kingdom',
		textVi: 'Giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(kingdoms?)\b|\b(giới)\b/i
	},
	subkingdom: {
		level: 3,
		name: 'subkingdom',
		textEn: 'Subkingdom',
		textVi: 'Phân giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(subkingdoms?)\b|\b(phân giới)\b/i
	},
	infrakingdom: {
		level: 4,
		name: 'infrakingdom',
		textEn: 'Infrakingdom',
		textVi: 'Thứ giới',
		groupName: 'kingdom',
		colorClass: 'text-indigo-300',
		regex: /\b(infrakingdoms?)\b|\b(thứ giới)\b/i
	},
	superphylum: {
		level: 5,
		name: 'superphylum',
		textEn: 'Superphylum',
		textVi: 'Liên ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(superphylums?|superdivisions?)\b|\b(liên ngành)\b/i
	},
	phylum: {
		level: 6,
		name: 'phylum',
		textEn: 'Phylum',
		textVi: 'Ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(phylums?|divisions?)\b|\b(ngành)\b/i
	},
	subphylum: {
		level: 7,
		name: 'subphylum',
		textEn: 'Subphylum',
		textVi: 'Phân ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(subphylums?|subdivisions?)\b|\b(phân ngành)\b/i
	},
	infraphylum: {
		level: 8,
		name: 'infraphylum',
		textEn: 'Infraphylum',
		textVi: 'Thứ ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(infraphylums?)\b|\b(thứ ngành)\b/i
	},
	microphylum: {
		level: 9,
		name: 'microphylum',
		textEn: 'Microphylum',
		textVi: 'Tiểu ngành',
		groupName: 'phylum',
		colorClass: 'text-pink-400',
		regex: /\b(microphylums?)\b|\b(tiểu ngành)\b/i
	},
	superclass: {
		level: 10,
		name: 'superclass',
		textEn: 'Superclass',
		textVi: 'Liên lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(superclass(es)?)\b|\b(liên lớp)\b/i
	},
	class: {
		level: 11,
		name: 'class',
		textEn: 'Class',
		textVi: 'Lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(class(es)?)\b|\b(lớp)\b/i
	},
	subclass: {
		level: 12,
		name: 'subclass',
		textEn: 'Subclass',
		textVi: 'Phân lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(subclass(es)?)\b|\b(phân lớp)\b/i
	},
	infraclass: {
		level: 13,
		name: 'infraclass',
		textEn: 'Infraclass',
		textVi: 'Thứ lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(infraclass(es)?)\b|\b(thứ lớp)\b/i
	},
	parvclass: {
		level: 14,
		name: 'parvclass',
		textEn: 'Parvclass',
		textVi: 'Tiểu lớp',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(parvclass(es)?)\b|\b(tiểu lớp)\b/i
	},
	legion: {
		level: 15,
		name: 'legion',
		textEn: 'Legion',
		textVi: 'Đoàn',
		groupName: 'class',
		colorClass: 'text-orange-300',
		regex: /\b(legions?)\b|\B(đoàn)\b/i
	},
	supercohort: {
		level: 16,
		name: 'supercohort',
		textEn: 'Supercohort',
		textVi: 'Liên đội',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(supercohorts?)\b|\b(liên đội)\b/i
	},
	cohort: {
		level: 17,
		name: 'cohort',
		textEn: 'Cohort',
		textVi: 'Đội',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(cohorts?)\b|\B(đội)\b/i
	},
	magnorder: {
		level: 18,
		name: 'magnorder',
		textEn: 'Magnorder',
		textVi: 'Tổng bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(magnorders?|megaorders?)\b|\b(tổng bộ)\B/i
	},
	superorder: {
		level: 19,
		name: 'superorder',
		textEn: 'Superorder',
		textVi: 'Liên bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(superorders?)\b|\b(liên bộ)\B/i
	},
	order: {
		level: 20,
		name: 'order',
		textEn: 'Order',
		textVi: 'Bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(orders?)\b|\b(bộ)\B/i
	},
	suborder: {
		level: 21,
		name: 'suborder',
		textEn: 'Suborder',
		textVi: 'Phân bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(suborders?)\b|\b(phân bộ)\B/i
	},
	infraorder: {
		level: 22,
		name: 'infraorder',
		textEn: 'Infraorder',
		textVi: 'Thứ bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(infraorders?)\b|\b(thứ bộ)\B/i
	},
	parvorder: {
		level: 23,
		name: 'parvorder',
		textEn: 'Parvorder',
		textVi: 'Tiểu bộ',
		groupName: 'order',
		colorClass: 'text-blue-300',
		regex: /\b(parvorders?)\b|\b(tiểu bộ)\B/i
	},
	section: {
		level: 24,
		name: 'section',
		textEn: 'Section',
		textVi: 'Đoạn',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(sections?)\b|\B(đoạn)\b/i
	},
	subsection: {
		level: 25,
		name: 'subsection',
		textEn: 'Subsection',
		textVi: 'Phân đoạn',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(subsections?)\b|\b(phân đoạn)\b/i
	},
	superfamily: {
		level: 26,
		name: 'superfamily',
		textEn: 'Superfamily',
		textVi: 'Liên họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(superfamil(y|ies)?)\b|\b(liên họ)\B/i
	},
	family: {
		level: 27,
		name: 'family',
		textEn: 'Family',
		textVi: 'Họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(famil(y|ies)?)\b|\b(họ)\B/i
	},
	subfamily: {
		level: 28,
		name: 'subfamily',
		textEn: 'Subfamily',
		textVi: 'Phân họ',
		groupName: 'family',
		colorClass: 'text-emerald-300',
		regex: /\b(subfamil(y|ies)?)\b|\b(phân họ)\B/i
	},
	supertribe: {
		level: 29,
		name: 'supertribe',
		textEn: 'Supertribe',
		textVi: 'Liên tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(supertribes?)\b|\b(liên tông)\b/i
	},
	tribe: {
		level: 30,
		name: 'tribe',
		textEn: 'Tribe',
		textVi: 'Tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(tribes?)\b|\b(tông)\b/i
	},
	subtribe: {
		level: 31,
		name: 'subtribe',
		textEn: 'Subtribe',
		textVi: 'Phân tông',
		groupName: 'tribe',
		colorClass: 'text-fuchsia-300',
		regex: /\b(subtribes?)\b|\b(phân tông)\b/i
	},
	genus: {
		level: 32,
		name: 'genus',
		textEn: 'Genus',
		textVi: 'Chi',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(gen(us|era)?)\b|\b(chi)\b/i
	},
	subgenus: {
		level: 33,
		name: 'subgenus',
		textEn: 'Subgenus',
		textVi: 'Phân chi',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(subgen(us|era)?)\b|\b(phân chi)\b/i
	},
	section2: {
		level: 34,
		name: 'section2',
		textEn: 'Section',
		textVi: 'Mục',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(sections?)\b|\b(mục)\b/i
	},
	subsection2: {
		level: 35,
		name: 'subsection2',
		textEn: 'Subsection',
		textVi: 'Phân mục',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(subsections?)\b|\b(phân mục)\b/i
	},
	series: {
		level: 36,
		name: 'series',
		textEn: 'Series',
		textVi: 'Loạt',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(series)\b|\b(loạt)\b/i
	},
	subseries: {
		level: 37,
		name: 'subseries',
		textEn: 'Subseries',
		textVi: 'Phân loạt',
		groupName: 'genus',
		colorClass: 'text-amber-200',
		regex: /\b(subseries)\b|\b(phân loạt)\b/i
	},
	superspecies: {
		level: 38,
		name: 'superspecies',
		textEn: 'Superspecies',
		textVi: 'Liên loài',
		groupName: 'species',
		colorClass: 'text-white',
		regex: /\b(superspecies)\b|\b(liên loài)\b/i
	},
	species: {
		level: 39,
		name: 'species',
		textEn: 'Species',
		textVi: 'Loài',
		groupName: 'species',
		colorClass: 'text-white',
		regex: /\b(species)\b|\b(loài)\b/i
	},
	subspecies: {
		level: 40,
		name: 'subspecies',
		textEn: 'Subspecies',
		textVi: 'Phân loài',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(subspecies)\b|\b(phân loài)\b/i,
		abbrPrefix: 'ssp.'
	},
	variety: {
		level: 41,
		name: 'variety',
		textEn: 'Variety',
		textVi: 'Thứ',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(variet(y|ies)?)\b|\b(thứ)\B/i,
		abbrPrefix: 'var.'
	},
	form: {
		level: 42,
		name: 'form',
		textEn: 'Form',
		textVi: 'Dạng',
		groupName: 'subspecies',
		colorClass: 'text-violet-300',
		regex: /\b(forms?)\b|\b(dạng)\b/i,
		abbrPrefix: 'f.'
	}
}

/**
 * Danh sách các rank.
 */
export const Ranks: Rank[] = Object.values(RanksMap).sort(
	(rankA, rankB) => rankA.level - rankB.level
)

/**
 * Cố gắng tìm rank bằng các tên tương tự với tên chuẩn.
 * @param similarName Tên rank muốn tìm. Tên có thể gần giống với tên chuẩn.
 * @returns Rank tìm thấy hoặc `undefined` nếu không tìm thấy.
 * @example
 * findRankBySimilarName('Phân họ') // Rank subfamily
 * findRankBySimilarName('Subfamilies') // Rank subfamily
 * findRankBySimilarName('Subfami') // undefined
 */
export function findRankBySimilarName(similarName: string): Rank | undefined {
	for (const rank of Ranks) {
		if (rank.regex?.test(similarName)) {
			return rank
		}
	}
}

/**
 * Kiểm tra xem rank có nhỏ hơn loài không.
 * @param rankOrTaxon Rank hoặc taxon.
 */
export function lessThanSpecies(rankOrTaxon: Rank | Taxon): boolean {
	const rank: Rank = 'rank' in rankOrTaxon ? rankOrTaxon.rank : rankOrTaxon
	return rank.level > RanksMap.species.level
}

/**
 * Kiểm tra xem rank có nhỏ hơn hoặc bằng loài không.
 * @param rankOrTaxon Rank hoặc taxon.
 */
export function lessThanOrEqualSpecies(rankOrTaxon: Rank | Taxon): boolean {
	const rank: Rank = 'rank' in rankOrTaxon ? rankOrTaxon.rank : rankOrTaxon
	return rank.level >= RanksMap.species.level
}
