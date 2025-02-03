export type PhotoSourceName =
	| 'imgur'
	| 'wikipedia'
	| 'inaturalist'
	| 'flickr'
	| 'biolib'
	| 'bugguide'
	| 'fishbase'
	| 'ebird'
	| 'reptileDatabase'
	| 'fishwisePro'
	| 'shorefishes'
	| 'github'
	| 'pinterest'
	| 'worms'
	| 'reefLifeSurvey'
	| 'other'

export type PhotoSource = {
	name: PhotoSourceName
	text: string
	textEn?: string
	textVi?: string
}

export const photoSourcesMap: Record<PhotoSourceName, PhotoSource> = {
	imgur: {
		name: 'imgur',
		text: 'Imgur'
	},
	wikipedia: {
		name: 'wikipedia',
		text: 'Wikipedia'
	},
	inaturalist: {
		name: 'inaturalist',
		text: 'iNaturalist'
	},
	flickr: {
		name: 'flickr',
		text: 'Flickr'
	},
	biolib: {
		name: 'biolib',
		text: 'BioLib'
	},
	bugguide: {
		name: 'bugguide',
		text: 'BugGuide'
	},
	fishbase: {
		name: 'fishbase',
		text: 'FishBase'
	},
	ebird: {
		name: 'ebird',
		text: 'eBird'
	},
	reptileDatabase: {
		name: 'reptileDatabase',
		text: 'Reptile Database'
	},
	fishwisePro: {
		name: 'fishwisePro',
		text: 'Fishwise Pro'
	},
	shorefishes: {
		name: 'shorefishes',
		text: 'Shorefishes'
	},
	github: {
		name: 'github',
		text: 'GitHub'
	},
	pinterest: {
		name: 'pinterest',
		text: 'Pinterest'
	},
	worms: {
		name: 'worms',
		text: 'WoRMS'
	},
	reefLifeSurvey: {
		name: 'reefLifeSurvey',
		text: 'Reef Life Survey'
	},
	other: {
		name: 'other',
		text: 'Other',
		textEn: 'Other',
		textVi: 'Khác'
	}
}
