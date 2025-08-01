/** Tên viết tắt của tình trạng bảo tồn. */
export const enum ConservationStatusName {
	/** Tuyệt chủng. */
	EX = 'EX',
	/** Tuyệt chủng trong tự nhiên. */
	EW = 'EW',
	/** Cực kỳ nguy cấp. */
	CR = 'CR',
	/** Nguy cấp. */
	EN = 'EN',
	/** Sắp nguy cấp. */
	VU = 'VU',
	/** Sắp bị đe dọa. */
	NT = 'NT',
	/** Ít quan tâm. */
	LC = 'LC',
	/** Thiếu dữ liệu. */
	DD = 'DD',
	/** Không được đánh giá. */
	NE = 'NE'
}

/** Một mục tình trạng bảo tồn. */
export type ConservationStatus = {
	index: number
	name: ConservationStatusName
	colorClass: string
}

/** Mảng các mục tình trạng bảo tồn. */
export const conservationStatuses: ConservationStatus[] = [
	{
		index: 0,
		name: ConservationStatusName.EX,
		colorClass: 'bg-zinc-900 text-zinc-100'
	},
	{
		index: 1,
		name: ConservationStatusName.EW,
		colorClass: 'bg-purple-900 text-purple-100'
	},
	{
		index: 2,
		name: ConservationStatusName.CR,
		colorClass: 'bg-red-600 text-red-100'
	},
	{
		index: 3,
		name: ConservationStatusName.EN,
		colorClass: 'bg-orange-600 text-orange-100'
	},
	{
		index: 4,
		name: ConservationStatusName.VU,
		colorClass: 'bg-yellow-600 text-yellow-100'
	},
	{
		index: 5,
		name: ConservationStatusName.NT,
		colorClass: 'bg-lime-600 text-lime-100'
	},
	{
		index: 6,
		name: ConservationStatusName.LC,
		colorClass: 'bg-teal-600 text-teal-100'
	},
	{
		index: 7,
		name: ConservationStatusName.DD,
		colorClass: 'bg-gray-600 text-gray-100'
	},
	{
		index: 8,
		name: ConservationStatusName.NE,
		colorClass: 'bg-stone-600 text-zinc-100'
	}
]

/** Đối tượng chứa các mục tình trạng bảo tồn. */
export const conservationStatusesMap = Object.fromEntries(
	conservationStatuses.map((status) => {
		return [status.name, status]
	})
)
