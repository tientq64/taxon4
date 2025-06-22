import { keyBy, round } from 'lodash-es'
import { GeoRankName, GeoTime, GeoTimeInput } from './geoTimes'
import { periodsMap } from './periods'

export const enum EpochName {
	Terreneuvian = 'Terreneuvian',
	CambrianSeries2 = 'CambrianSeries2',
	Miaolingian = 'Miaolingian',
	Furongian = 'Furongian',
	EarlyOrdovician = 'EarlyOrdovician',
	MiddleOrdovician = 'MiddleOrdovician',
	LateOrdovician = 'LateOrdovician',
	Pridoli = 'Pridoli',
	Ludlow = 'Ludlow',
	Wenlock = 'Wenlock',
	Llandovery = 'Llandovery',
	EarlyDevonian = 'EarlyDevonian',
	MiddleDevonian = 'MiddleDevonian',
	LateDevonian = 'LateDevonian',
	Mississippian = 'Mississippian',
	Pennsylvanian = 'Pennsylvanian',
	Cisuralian = 'Cisuralian',
	Guadalupian = 'Guadalupian',
	Lopingian = 'Lopingian',
	EarlyTriassic = 'EarlyTriassic',
	MiddleTriassic = 'MiddleTriassic',
	LateTriassic = 'LateTriassic',
	EarlyJurassic = 'EarlyJurassic',
	MiddleJurassic = 'MiddleJurassic',
	LateJurassic = 'LateJurassic',
	EarlyCretaceous = 'EarlyCretaceous',
	LateCretaceous = 'LateCretaceous',
	Paleocene = 'Paleocene',
	Eocene = 'Eocene',
	Oligocene = 'Oligocene',
	Miocene = 'Miocene',
	Pliocene = 'Pliocene',
	Pleistocene = 'Pleistocene',
	Holocene = 'Holocene'
}

/** Đại diện cho một thế. */
export interface Epoch extends GeoTime<EpochName> {}

type EpochInput = GeoTimeInput<Epoch>

const epochsInput: EpochInput[] = [
	{
		name: EpochName.Terreneuvian,
		startMa: periodsMap.Cambrian.startMa,
		aliasTexts: ['Early Cambrian']
	},
	{
		name: EpochName.CambrianSeries2,
		startMa: 521,
		aliasTexts: ['Early Cambrian']
	},
	{
		name: EpochName.Miaolingian,
		startMa: 506.5,
		aliasTexts: ['Middle Cambrian']
	},
	{
		name: EpochName.Furongian,
		startMa: 497,
		aliasTexts: ['Late Cambrian']
	},
	{
		name: EpochName.EarlyOrdovician,
		startMa: periodsMap.Ordovician.startMa
	},
	{
		name: EpochName.MiddleOrdovician,
		startMa: 471.3
	},
	{
		name: EpochName.LateOrdovician,
		startMa: 458.2
	},
	{
		name: EpochName.Llandovery,
		startMa: periodsMap.Silurian.startMa
	},
	{
		name: EpochName.Wenlock,
		startMa: 433.4
	},
	{
		name: EpochName.Ludlow,
		startMa: 427.4
	},
	{
		name: EpochName.Pridoli,
		startMa: 423
	},
	{
		name: EpochName.EarlyDevonian,
		startMa: periodsMap.Devonian.startMa
	},
	{
		name: EpochName.MiddleDevonian,
		startMa: 393.3
	},
	{
		name: EpochName.LateDevonian,
		startMa: 382.7
	},
	{
		name: EpochName.Mississippian,
		startMa: periodsMap.Carboniferous.startMa
	},
	{
		name: EpochName.Pennsylvanian,
		startMa: 323.2
	},
	{
		name: EpochName.Cisuralian,
		startMa: periodsMap.Permian.startMa
	},
	{
		name: EpochName.Guadalupian,
		startMa: 273.01
	},
	{
		name: EpochName.Lopingian,
		startMa: 259.51
	},
	{
		name: EpochName.EarlyTriassic,
		startMa: periodsMap.Triassic.startMa
	},
	{
		name: EpochName.MiddleTriassic,
		startMa: 246.7
	},
	{
		name: EpochName.LateTriassic,
		startMa: 237
	},
	{
		name: EpochName.EarlyJurassic,
		startMa: periodsMap.Jurassic.startMa
	},
	{
		name: EpochName.MiddleJurassic,
		startMa: 174.7
	},
	{
		name: EpochName.LateJurassic,
		startMa: 161.5
	},
	{
		name: EpochName.EarlyCretaceous,
		startMa: periodsMap.Cretaceous.startMa
	},
	{
		name: EpochName.LateCretaceous,
		startMa: 100.5
	},
	{
		name: EpochName.Paleocene,
		startMa: periodsMap.Paleogene.startMa
	},
	{
		name: EpochName.Eocene,
		startMa: 56
	},
	{
		name: EpochName.Oligocene,
		startMa: 33.9
	},
	{
		name: EpochName.Miocene,
		startMa: periodsMap.Neogene.startMa
	},
	{
		name: EpochName.Pliocene,
		startMa: 5.333
	},
	{
		name: EpochName.Pleistocene,
		startMa: 2.58
	},
	{
		name: EpochName.Holocene,
		startMa: 0.0117
	}
]

export const epochs: Epoch[] = []
epochsInput.forEach((epochInput, i) => {
	const nextEpochInput: EpochInput | undefined = epochsInput.at(i + 1)

	const endMa: number = epochInput.endMa ?? nextEpochInput?.startMa ?? 0
	const duration: number = round(epochInput.startMa - endMa, 3)
	const aliasTexts: string[] = epochInput.aliasTexts ?? []

	epochs.push({
		...epochInput,
		rankName: GeoRankName.Epoch,
		endMa,
		duration,
		aliasTexts
	})
})

export const epochsMap = keyBy(epochs, 'name') as Record<EpochName, Epoch>
