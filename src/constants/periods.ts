import { keyBy, round } from 'lodash-es'
import { GeoRankName, GeoTime, GeoTimeInput } from './geoTimes'

export const enum PeriodName {
	Precambrian = 'Precambrian',
	Cambrian = 'Cambrian',
	Ordovician = 'Ordovician',
	Silurian = 'Silurian',
	Devonian = 'Devonian',
	Carboniferous = 'Carboniferous',
	Permian = 'Permian',
	Triassic = 'Triassic',
	Jurassic = 'Jurassic',
	Cretaceous = 'Cretaceous',
	Paleogene = 'Paleogene',
	Neogene = 'Neogene',
	Quaternary = 'Quaternary'
}

/** Đại diện cho một kỷ. */
export interface Period extends GeoTime<PeriodName> {
	/** Tên viết tắt. */
	abbr: string
	/** Class tạo màu cho kỷ khi hiển thị. */
	colorClass: string
}

type PeriodInput = GeoTimeInput<Period>

const periodsInput: PeriodInput[] = [
	{
		name: PeriodName.Precambrian,
		abbr: 'PreЄ',
		startMa: 635,
		colorClass: 'bg-gradient-to-r from-white to-75% to-amber-200'
	},
	{
		name: PeriodName.Cambrian,
		abbr: 'Є',
		startMa: 538.8,
		colorClass: 'bg-lime-200/50'
	},
	{
		name: PeriodName.Ordovician,
		abbr: 'O',
		startMa: 486.85,
		colorClass: 'bg-teal-500/70'
	},
	{
		name: PeriodName.Silurian,
		abbr: 'S',
		startMa: 443.8,
		colorClass: 'bg-emerald-100/70'
	},
	{
		name: PeriodName.Devonian,
		abbr: 'D',
		startMa: 419.2,
		colorClass: 'bg-orange-300/60'
	},
	{
		name: PeriodName.Carboniferous,
		abbr: 'C',
		startMa: 358.9,
		colorClass: 'bg-cyan-400/70'
	},
	{
		name: PeriodName.Permian,
		abbr: 'P',
		startMa: 298.9,
		colorClass: 'bg-red-400/90'
	},
	{
		name: PeriodName.Triassic,
		abbr: 'T',
		startMa: 251.9,
		colorClass: 'bg-purple-500/70'
	},
	{
		name: PeriodName.Jurassic,
		abbr: 'J',
		startMa: 201.3,
		colorClass: 'bg-sky-400/70'
	},
	{
		name: PeriodName.Cretaceous,
		abbr: 'K',
		startMa: 143.1,
		colorClass: 'bg-green-300/70'
	},
	{
		name: PeriodName.Paleogene,
		abbr: 'Pg',
		startMa: 66,
		colorClass: 'bg-orange-300/90'
	},
	{
		name: PeriodName.Neogene,
		abbr: 'N',
		startMa: 23.03,
		colorClass: 'bg-amber-300'
	},
	{
		name: PeriodName.Quaternary,
		abbr: '',
		startMa: 2.58,
		colorClass: 'bg-yellow-200'
	}
]

export const periods: Period[] = []
periodsInput.forEach((periodInput, i) => {
	const nextPeriodInput: PeriodInput | undefined = periodsInput.at(i + 1)

	const endMa: number = periodInput.endMa ?? nextPeriodInput?.startMa ?? 0
	const duration: number = round(periodInput.startMa - endMa, 3)
	const aliasTexts: string[] = periodInput.aliasTexts ?? []

	periods.push({
		...periodInput,
		rankName: GeoRankName.Period,
		endMa,
		duration,
		aliasTexts
	})
})

export const periodsMap = keyBy(periods, 'name') as Record<PeriodName, Period>

export const totalPeriodsDuration: number = periods[0].startMa
