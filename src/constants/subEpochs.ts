import { keyBy, round } from 'lodash-es'
import { epochsMap } from './epochs'
import { GeoRankName, GeoTime, GeoTimeInput } from './geoTimes'

export const enum SubEpochName {
	EarlyMiocene = 'EarlyMiocene',
	MiddleMiocene = 'MiddleMiocene',
	LateMiocene = 'LateMiocene',
	EarlyPliocene = 'EarlyPliocene',
	LatePliocene = 'LatePliocene'
}

/** Đại diện cho một phân thế. */
export interface SubEpoch extends GeoTime<SubEpochName> {}

type SubEpochInput = GeoTimeInput<SubEpoch>

const subEpochsInput: SubEpochInput[] = [
	{
		name: SubEpochName.EarlyMiocene,
		startMa: epochsMap.Miocene.startMa
	},
	{
		name: SubEpochName.MiddleMiocene,
		startMa: 15.97
	},
	{
		name: SubEpochName.LateMiocene,
		startMa: 11.63,
		endMa: epochsMap.Miocene.endMa
	},
	{
		name: SubEpochName.EarlyPliocene,
		startMa: epochsMap.Pliocene.startMa
	},
	{
		name: SubEpochName.LatePliocene,
		startMa: 3.6,
		endMa: epochsMap.Pliocene.endMa
	}
]

export const subEpochs: SubEpoch[] = []
subEpochsInput.forEach((subEpochInput, i) => {
	const nextSubEpochInput: SubEpochInput | undefined = subEpochsInput.at(i + 1)

	const endMa: number = subEpochInput.endMa ?? nextSubEpochInput?.startMa ?? 0
	const duration: number = round(subEpochInput.startMa - endMa, 3)
	const aliasTexts: string[] = subEpochInput.aliasTexts ?? []

	subEpochs.push({
		...subEpochInput,
		rankName: GeoRankName.SubEpoch,
		endMa,
		duration,
		aliasTexts
	})
})

export const subEpochsMap = keyBy(subEpochs, 'name') as Record<SubEpochName, SubEpoch>
