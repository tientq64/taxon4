import { Epoch, EpochName } from './epochs'
import { Period, PeriodName } from './periods'
import { SubEpoch, SubEpochName } from './subEpochs'

export enum GeoRankName {
	/** Kỷ. */
	Period = 'period',
	/** Thế. */
	Epoch = 'epoch',
	/** Phân thế. */
	SubEpoch = 'subEpoch'
}

/** Đại diện cho một thời địa chất. */
export interface GeoTime<T> {
	/** Tên của thời địa chất. */
	name: T

	/** Bậc của thời địa chất. Vd: Kỷ, thế, phân thế. */
	rankName: GeoRankName

	/** Khoảng thời gian bắt đầu, tính bằng triệu năm. */
	startMa: number

	/** Khoảng thời gian kết thúc, tính bằng triệu năm. */
	endMa: number

	/** Khoảng thời gian kéo dài, tính bằng triệu năm. */
	duration: number

	/** Các tên tiếng Anh tương tự khác của thời địa chất này. */
	aliasTexts: string[]
}

export type GeoTimeInput<T> = Omit<T, 'rankName' | 'endMa' | 'duration' | 'aliasTexts'> & {
	endMa?: number
	aliasTexts?: string[]
}

export type GeoTimeType = Period | Epoch | SubEpoch
export type GeoTimeName = PeriodName | EpochName | SubEpochName
