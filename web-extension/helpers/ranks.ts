export type Rank = {
	level: number
	name: string
	textEn: string
	textVi: string
	colorClass: string
	regex?: RegExp
	abbr?: string
}

export const ranks: Rank[] = [
	{
		level: 0,
		name: 'life',
		textEn: 'Life',
		textVi: 'Sự sống',
		colorClass: 'text-indigo-300'
	},
	{
		level: 1,
		name: 'domain',
		textEn: 'Domain',
		textVi: 'Vực',
		colorClass: 'text-indigo-300',
		regex: /\b(domains?)\b|\b(vực)\b/i
	},
	{
		level: 2,
		name: 'kingdom',
		textEn: 'Kingdom',
		textVi: 'Giới',
		colorClass: 'text-indigo-300',
		regex: /\b(kingdoms?)\b|\b(giới)\b/i
	},
	{
		level: 3,
		name: 'subkingdom',
		textEn: 'Subkingdom',
		textVi: 'Phân giới',
		colorClass: 'text-indigo-300',
		regex: /\b(subkingdoms?)\b|\b(phân giới)\b/i
	},
	{
		level: 4,
		name: 'infrakingdom',
		textEn: 'Infrakingdom',
		textVi: 'Thứ giới',
		colorClass: 'text-indigo-300',
		regex: /\b(infrakingdoms?)\b|\b(thứ giới)\b/i
	},
	{
		level: 5,
		name: 'superphylum',
		textEn: 'Superphylum',
		textVi: 'Liên ngành',
		colorClass: 'text-pink-400',
		regex: /\b(superphylums?)\b|\b(liên ngành)\b/i
	},
	{
		level: 6,
		name: 'phylum',
		textEn: 'Phylum',
		textVi: 'Ngành',
		colorClass: 'text-pink-400',
		regex: /\b(phylums?)\b|\b(ngành)\b/i
	},
	{
		level: 7,
		name: 'subphylum',
		textEn: 'Subphylum',
		textVi: 'Phân ngành',
		colorClass: 'text-pink-400',
		regex: /\b(subphylums?)\b|\b(phân ngành)\b/i
	},
	{
		level: 8,
		name: 'infraphylum',
		textEn: 'Infraphylum',
		textVi: 'Thứ ngành',
		colorClass: 'text-pink-400',
		regex: /\b(infraphylums?)\b|\b(thứ ngành)\b/i
	},
	{
		level: 9,
		name: 'parvphylum',
		textEn: 'Parvphylum',
		textVi: 'Tiểu ngành',
		colorClass: 'text-pink-400',
		regex: /\b(parvphylums?)\b|\b(tiểu ngành)\b/i
	},
	{
		level: 10,
		name: 'superclass',
		textEn: 'Superclass',
		textVi: 'Liên lớp',
		colorClass: 'text-orange-300',
		regex: /\b(superclass(es)?)\b|\b(liên lớp)\b/i
	},
	{
		level: 11,
		name: 'class',
		textEn: 'Class',
		textVi: 'Lớp',
		colorClass: 'text-orange-300',
		regex: /\b(class(es)?)\b|\b(lớp)\b/i
	},
	{
		level: 12,
		name: 'subclass',
		textEn: 'Subclass',
		textVi: 'Phân lớp',
		colorClass: 'text-orange-300',
		regex: /\b(subclass(es)?)\b|\b(phân lớp)\b/i
	},
	{
		level: 13,
		name: 'infraclass',
		textEn: 'Infraclass',
		textVi: 'Thứ lớp',
		colorClass: 'text-orange-300',
		regex: /\b(infraclass(es)?)\b|\b(thứ lớp)\b/i
	},
	{
		level: 14,
		name: 'parvclass',
		textEn: 'Parvclass',
		textVi: 'Tiểu lớp',
		colorClass: 'text-orange-300',
		regex: /\b(parvclass(es)?)\b|\b(tiểu lớp)\b/i
	},
	{
		level: 15,
		name: 'legion',
		textEn: 'Legion',
		textVi: 'Đoàn',
		colorClass: 'text-orange-300',
		regex: /\b(legions?)\b|\B(đoàn)\b/i
	},
	{
		level: 16,
		name: 'supercohort',
		textEn: 'Supercohort',
		textVi: 'Liên đội',
		colorClass: 'text-blue-300',
		regex: /\b(supercohorts?)\b|\b(liên đội)\b/i
	},
	{
		level: 17,
		name: 'cohort',
		textEn: 'Cohort',
		textVi: 'Đội',
		colorClass: 'text-blue-300',
		regex: /\b(cohorts?)\b|\B(đội)\b/i
	},
	{
		level: 18,
		name: 'megaorder',
		textEn: 'Megaorder',
		textVi: 'Tổng bộ',
		colorClass: 'text-blue-300',
		regex: /\b(megaorders?)\b|\b(tổng bộ)\B/i
	},
	{
		level: 19,
		name: 'superorder',
		textEn: 'Superorder',
		textVi: 'Liên bộ',
		colorClass: 'text-blue-300',
		regex: /\b(superorders?)\b|\b(liên bộ)\B/i
	},
	{
		level: 20,
		name: 'order',
		textEn: 'Order',
		textVi: 'Bộ',
		colorClass: 'text-blue-300',
		regex: /\b(orders?)\b|\b(bộ)\B/i
	},
	{
		level: 21,
		name: 'suborder',
		textEn: 'Suborder',
		textVi: 'Phân bộ',
		colorClass: 'text-blue-300',
		regex: /\b(suborders?)\b|\b(phân bộ)\B/i
	},
	{
		level: 22,
		name: 'infraorder',
		textEn: 'Infraorder',
		textVi: 'Thứ bộ',
		colorClass: 'text-blue-300',
		regex: /\b(infraorders?)\b|\b(thứ bộ)\B/i
	},
	{
		level: 23,
		name: 'parvorder',
		textEn: 'Parvorder',
		textVi: 'Tiểu bộ',
		colorClass: 'text-blue-300',
		regex: /\b(parvorders?)\b|\b(tiểu bộ)\B/i
	},
	{
		level: 24,
		name: 'section',
		textEn: 'Section',
		textVi: 'Đoạn',
		colorClass: 'text-emerald-300',
		regex: /\b(sections?)\b|\B(đoạn)\b/i
	},
	{
		level: 25,
		name: 'subsection',
		textEn: 'Subsection',
		textVi: 'Phân đoạn',
		colorClass: 'text-emerald-300',
		regex: /\b(subsections?)\b|\b(phân đoạn)\b/i
	},
	{
		level: 26,
		name: 'superfamily',
		textEn: 'Superfamily',
		textVi: 'Liên họ',
		colorClass: 'text-emerald-300',
		regex: /\b(superfamil(y|ies)?)\b|\b(liên họ)\B/i
	},
	{
		level: 27,
		name: 'family',
		textEn: 'Family',
		textVi: 'Họ',
		colorClass: 'text-emerald-300',
		regex: /\b(famil(y|ies)?)\b|\b(họ)\B/i
	},
	{
		level: 28,
		name: 'subfamily',
		textEn: 'Subfamily',
		textVi: 'Phân họ',
		colorClass: 'text-emerald-300',
		regex: /\b(subfamil(y|ies)?)\b|\b(phân họ)\B/i
	},
	{
		level: 29,
		name: 'supertribe',
		textEn: 'Supertribe',
		textVi: 'Liên tông',
		colorClass: 'text-purple-300',
		regex: /\b(supertribes?)\b|\b(liên tông)\b/i
	},
	{
		level: 30,
		name: 'tribe',
		textEn: 'Tribe',
		textVi: 'Tông',
		colorClass: 'text-purple-300',
		regex: /\b(tribes?)\b|\b(tông)\b/i
	},
	{
		level: 31,
		name: 'subtribe',
		textEn: 'Subtribe',
		textVi: 'Phân tông',
		colorClass: 'text-purple-300',
		regex: /\b(subtribes?)\b|\b(phân tông)\b/i
	},
	{
		level: 32,
		name: 'genus',
		textEn: 'Genus',
		textVi: 'Chi',
		colorClass: 'text-amber-200',
		regex: /\b(gen(us|era)?)\b|\b(chi)\b/i
	},
	{
		level: 33,
		name: 'subgenus',
		textEn: 'Subgenus',
		textVi: 'Phân chi',
		colorClass: 'text-amber-200',
		regex: /\b(subgen(us|era)?)\b|\b(phân chi)\b/i
	},
	{
		level: 34,
		name: 'section',
		textEn: 'Section',
		textVi: 'Mục',
		colorClass: 'text-amber-200',
		regex: /\b(sections?)\b|\b(mục)\b/i
	},
	{
		level: 35,
		name: 'subsection',
		textEn: 'Subsection',
		textVi: 'Phân mục',
		colorClass: 'text-amber-200',
		regex: /\b(subsections?)\b|\b(phân mục)\b/i
	},
	{
		level: 36,
		name: 'series',
		textEn: 'Series',
		textVi: 'Loạt',
		colorClass: 'text-amber-200',
		regex: /\b(series)\b|\b(loạt)\b/i
	},
	{
		level: 37,
		name: 'subseries',
		textEn: 'Subseries',
		textVi: 'Phân loạt',
		colorClass: 'text-amber-200',
		regex: /\b(subseries)\b|\b(phân loạt)\b/i
	},
	{
		level: 38,
		name: 'superspecies',
		textEn: 'Superspecies',
		textVi: 'Liên loài',
		colorClass: 'text-white',
		regex: /\b(superspecies)\b|\b(liên loài)\b/i
	},
	{
		level: 39,
		name: 'species',
		textEn: 'Species',
		textVi: 'Loài',
		colorClass: 'text-white',
		regex: /\b(species)\b|\b(loài)\b/i
	},
	{
		level: 40,
		name: 'subspecies',
		textEn: 'Subspecies',
		textVi: 'Phân loài',
		colorClass: 'text-violet-300',
		regex: /\b(subspecies)\b|\b(phân loài)\b/i,
		abbr: 'ssp.'
	},
	{
		level: 41,
		name: 'variety',
		textEn: 'Variety',
		textVi: 'Thứ',
		colorClass: 'text-violet-300',
		regex: /\b(variet(y|ies)?)\b|\b(thứ)\B/i,
		abbr: 'var.'
	},
	{
		level: 42,
		name: 'form',
		textEn: 'Form',
		textVi: 'Dạng',
		colorClass: 'text-violet-300',
		regex: /\b(forms?)\b|\b(dạng)\b/i,
		abbr: 'f.'
	}
]

export const ranksMap: Record<Rank['name'], Rank> = Object.fromEntries(
	ranks.map((rank) => [rank.name, rank])
)

export function findRankBySimilarName(similarName: string): Rank | undefined {
	for (const rank of ranks) {
		if (rank.regex?.test(similarName)) {
			return rank
		}
	}
}
