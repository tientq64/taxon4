export type ConservationStatusName = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'NE'

export type ConservationStatus = {
	index: number
	name: string
	textEn: string
	textVi: string
	colorClass: string
}

export const conservationStatusesMap: Record<ConservationStatusName, ConservationStatus> = {
	EX: {
		index: 0,
		name: 'EX',
		textEn: 'Extinct',
		textVi: 'Tuyệt chủng',
		colorClass: 'bg-zinc-800 border-black text-red-400'
	},
	EW: {
		index: 1,
		name: 'EW',
		textEn: 'Extinct in the wild',
		textVi: 'Tuyệt chủng trong tự nhiên',
		colorClass: 'bg-purple-900 border-black text-purple-200'
	},
	CR: {
		index: 2,
		name: 'CR',
		textEn: 'Critically endangered',
		textVi: 'Cực kỳ nguy cấp',
		colorClass: 'bg-red-600 border-red-900 text-red-100'
	},
	EN: {
		index: 3,
		name: 'EN',
		textEn: 'Endangered',
		textVi: 'Nguy cấp',
		colorClass: 'bg-orange-600 border-orange-800 text-orange-100'
	},
	VU: {
		index: 4,
		name: 'VU',
		textEn: 'Vulnerable',
		textVi: 'Sắp nguy cấp',
		colorClass: 'bg-yellow-600 border-yellow-800 text-yellow-100'
	},
	NT: {
		index: 5,
		name: 'NT',
		textEn: 'Near threatened',
		textVi: 'Sắp bị đe dọa',
		colorClass: 'bg-lime-600 border-lime-800 text-lime-100'
	},
	LC: {
		index: 6,
		name: 'LC',
		textEn: 'Least concern',
		textVi: 'Ít quan tâm',
		colorClass: 'bg-teal-600 border-teal-800 text-teal-100'
	},
	DD: {
		index: 7,
		name: 'DD',
		textEn: 'Data deficient',
		textVi: 'Thiếu dữ liệu',
		colorClass: 'bg-gray-500 border-gray-700 text-gray-100'
	},
	NE: {
		index: 8,
		name: 'NE',
		textEn: 'Not evaluated',
		textVi: 'Không được đánh giá',
		colorClass: 'bg-stone-400 border-stone-600 text-white'
	}
}

export const conservationStatuses: ConservationStatus[] = Object.values(
	conservationStatusesMap
).sort((statusA, statusB) => statusA.index - statusB.index)
