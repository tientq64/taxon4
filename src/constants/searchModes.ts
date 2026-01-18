export enum SearchModeName {
	Substring = 'substring',
	WholeWord = 'wholeWord',
	Exact = 'exact'
}

export interface SearchMode {
	name: SearchModeName
}

export const searchModes: SearchMode[] = [
	{
		name: SearchModeName.Substring
	},
	{
		name: SearchModeName.WholeWord
	},
	{
		name: SearchModeName.Exact
	}
]
