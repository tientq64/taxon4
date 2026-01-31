export enum SearchTargetName {
	All = 'all',
	ScientificName = 'scientificName',
	EnglishCommonName = 'englishCommonName',
	VietnameseCommonName = 'vietnameseCommonName'
}

export interface SearchTarget {
	name: SearchTargetName
}

export const searchTargets: SearchTarget[] = [
	{
		name: SearchTargetName.All
	},
	{
		name: SearchTargetName.ScientificName
	},
	{
		name: SearchTargetName.EnglishCommonName
	},
	{
		name: SearchTargetName.VietnameseCommonName
	}
]
