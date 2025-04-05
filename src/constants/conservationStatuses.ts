export const enum ConservationStatusName {
	EX = 'EX',
	EW = 'EW',
	CR = 'CR',
	EN = 'EN',
	VU = 'VU',
	NT = 'NT',
	LC = 'LC',
	DD = 'DD',
	NE = 'NE'
}

export type ConservationStatus = {
	index: number
	name: ConservationStatusName
	textEn: string
	textVi: string
	colorClass: string
}

export const conservationStatusesMap: Record<ConservationStatusName, ConservationStatus> = {
	EX: {
		index: 0,
		name: ConservationStatusName.EX,
		textEn: 'Extinct',
		textVi: 'Tuyệt chủng',
		colorClass: 'bg-zinc-800 border-black text-red-400'
	},
	EW: {
		index: 1,
		name: ConservationStatusName.EW,
		textEn: 'Extinct in the wild',
		textVi: 'Tuyệt chủng trong tự nhiên',
		colorClass: 'bg-purple-900 border-black text-purple-200'
	},
	CR: {
		index: 2,
		name: ConservationStatusName.CR,
		textEn: 'Critically endangered',
		textVi: 'Cực kỳ nguy cấp',
		colorClass: 'bg-red-600 border-red-400 text-red-100'
	},
	EN: {
		index: 3,
		name: ConservationStatusName.EN,
		textEn: 'Endangered',
		textVi: 'Nguy cấp',
		colorClass: 'bg-orange-600 border-orange-400 text-orange-100'
	},
	VU: {
		index: 4,
		name: ConservationStatusName.VU,
		textEn: 'Vulnerable',
		textVi: 'Sắp nguy cấp',
		colorClass: 'bg-yellow-600 border-yellow-400 text-yellow-100'
	},
	NT: {
		index: 5,
		name: ConservationStatusName.NT,
		textEn: 'Near threatened',
		textVi: 'Sắp bị đe dọa',
		colorClass: 'bg-lime-600 border-lime-400 text-lime-100'
	},
	LC: {
		index: 6,
		name: ConservationStatusName.LC,
		textEn: 'Least concern',
		textVi: 'Ít quan tâm',
		colorClass: 'bg-teal-600 border-teal-400 text-teal-100'
	},
	DD: {
		index: 7,
		name: ConservationStatusName.DD,
		textEn: 'Data deficient',
		textVi: 'Thiếu dữ liệu',
		colorClass: 'bg-gray-600 border-gray-400 text-gray-100'
	},
	NE: {
		index: 8,
		name: ConservationStatusName.NE,
		textEn: 'Not evaluated',
		textVi: 'Không được đánh giá',
		colorClass: 'bg-stone-600 border-stone-400 text-white'
	}
}

export const conservationStatuses: ConservationStatus[] = Object.values(
	conservationStatusesMap
).sort((statusA, statusB) => statusA.index - statusB.index)
