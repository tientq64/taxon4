export type Rank = {
	level: number
	name: string
	textEn: string
	textVi: string
	colorClass: string
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
		colorClass: 'text-indigo-300'
	},
	{
		level: 2,
		name: 'kingdom',
		textEn: 'Kingdom',
		textVi: 'Giới',
		colorClass: 'text-indigo-300'
	},
	{
		level: 3,
		name: 'subkingdom',
		textEn: 'Subkingdom',
		textVi: 'Phân giới',
		colorClass: 'text-indigo-300'
	},
	{
		level: 4,
		name: 'infrakingdom',
		textEn: 'Infrakingdom',
		textVi: 'Thứ giới',
		colorClass: 'text-indigo-300'
	},
	{
		level: 5,
		name: 'superphylum',
		textEn: 'Superphylum',
		textVi: 'Liên ngành',
		colorClass: 'text-pink-400'
	},
	{
		level: 6,
		name: 'phylum',
		textEn: 'Phylum',
		textVi: 'Ngành',
		colorClass: 'text-pink-400'
	},
	{
		level: 7,
		name: 'subphylum',
		textEn: 'Subphylum',
		textVi: 'Phân ngành',
		colorClass: 'text-pink-400'
	},
	{
		level: 8,
		name: 'infraphylum',
		textEn: 'Infraphylum',
		textVi: 'Thứ ngành',
		colorClass: 'text-pink-400'
	},
	{
		level: 9,
		name: 'parvphylum',
		textEn: 'Parvphylum',
		textVi: 'Tiểu ngành',
		colorClass: 'text-pink-400'
	},
	{
		level: 10,
		name: 'superclass',
		textEn: 'Superclass',
		textVi: 'Liên lớp',
		colorClass: 'text-orange-300'
	},
	{
		level: 11,
		name: 'class',
		textEn: 'Class',
		textVi: 'Lớp',
		colorClass: 'text-orange-300'
	},
	{
		level: 12,
		name: 'subclass',
		textEn: 'Subclass',
		textVi: 'Phân lớp',
		colorClass: 'text-orange-300'
	},
	{
		level: 13,
		name: 'infraclass',
		textEn: 'Infraclass',
		textVi: 'Thứ lớp',
		colorClass: 'text-orange-300'
	},
	{
		level: 14,
		name: 'parvclass',
		textEn: 'Parvclass',
		textVi: 'Tiểu lớp',
		colorClass: 'text-orange-300'
	},
	{
		level: 15,
		name: 'legion',
		textEn: 'Legion',
		textVi: 'Đoàn',
		colorClass: 'text-orange-300'
	},
	{
		level: 16,
		name: 'supercohort',
		textEn: 'Supercohort',
		textVi: 'Liên đội',
		colorClass: 'text-blue-300'
	},
	{
		level: 17,
		name: 'cohort',
		textEn: 'Cohort',
		textVi: 'Đội',
		colorClass: 'text-blue-300'
	},
	{
		level: 18,
		name: 'megaorder',
		textEn: 'Megaorder',
		textVi: 'Tổng bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 19,
		name: 'superorder',
		textEn: 'Superorder',
		textVi: 'Liên bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 20,
		name: 'order',
		textEn: 'Order',
		textVi: 'Bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 21,
		name: 'suborder',
		textEn: 'Suborder',
		textVi: 'Phân bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 22,
		name: 'infraorder',
		textEn: 'Infraorder',
		textVi: 'Thứ bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 23,
		name: 'parvorder',
		textEn: 'Parvorder',
		textVi: 'Tiểu bộ',
		colorClass: 'text-blue-300'
	},
	{
		level: 24,
		name: 'section',
		textEn: 'Section',
		textVi: 'Đoạn',
		colorClass: 'text-emerald-300'
	},
	{
		level: 25,
		name: 'subsection',
		textEn: 'Subsection',
		textVi: 'Phân đoạn',
		colorClass: 'text-emerald-300'
	},
	{
		level: 26,
		name: 'superfamily',
		textEn: 'Superfamily',
		textVi: 'Liên họ',
		colorClass: 'text-emerald-300'
	},
	{
		level: 27,
		name: 'family',
		textEn: 'Family',
		textVi: 'Họ',
		colorClass: 'text-emerald-300'
	},
	{
		level: 28,
		name: 'subfamily',
		textEn: 'Subfamily',
		textVi: 'Phân họ',
		colorClass: 'text-emerald-300'
	},
	{
		level: 29,
		name: 'supertribe',
		textEn: 'Supertribe',
		textVi: 'Liên tông',
		colorClass: 'text-purple-300'
	},
	{
		level: 30,
		name: 'tribe',
		textEn: 'Tribe',
		textVi: 'Tông',
		colorClass: 'text-purple-300'
	},
	{
		level: 31,
		name: 'subtribe',
		textEn: 'Subtribe',
		textVi: 'Phân tông',
		colorClass: 'text-purple-300'
	},
	{
		level: 32,
		name: 'genus',
		textEn: 'Genus',
		textVi: 'Chi',
		colorClass: 'text-amber-200'
	},
	{
		level: 33,
		name: 'subgenus',
		textEn: 'Subgenus',
		textVi: 'Phân chi',
		colorClass: 'text-amber-200'
	},
	{
		level: 34,
		name: 'section',
		textEn: 'Section',
		textVi: 'Mục',
		colorClass: 'text-amber-200'
	},
	{
		level: 35,
		name: 'subsection',
		textEn: 'Subsection',
		textVi: 'Phân mục',
		colorClass: 'text-amber-200'
	},
	{
		level: 36,
		name: 'series',
		textEn: 'Series',
		textVi: 'Loạt',
		colorClass: 'text-amber-200'
	},
	{
		level: 37,
		name: 'subseries',
		textEn: 'Subseries',
		textVi: 'Phân loạt',
		colorClass: 'text-amber-200'
	},
	{
		level: 38,
		name: 'superspecies',
		textEn: 'Superspecies',
		textVi: 'Liên loài',
		colorClass: 'text-white'
	},
	{
		level: 39,
		name: 'species',
		textEn: 'Species',
		textVi: 'Loài',
		colorClass: 'text-white'
	},
	{
		level: 40,
		name: 'subspecies',
		textEn: 'Subspecies',
		textVi: 'Phân loài',
		colorClass: 'text-violet-300',
		abbr: 'ssp.'
	},
	{
		level: 41,
		name: 'variety',
		textEn: 'Variety',
		textVi: 'Thứ',
		colorClass: 'text-violet-300',
		abbr: 'var.'
	},
	{
		level: 42,
		name: 'form',
		textEn: 'Form',
		textVi: 'Dạng',
		colorClass: 'text-violet-300',
		abbr: 'f.'
	}
]

export const ranksMap: Record<Rank['name'], Rank> = Object.fromEntries(
	ranks.map((rank) => [rank.name, rank])
)
