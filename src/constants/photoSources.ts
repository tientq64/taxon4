export const enum PhotoSourceName {
	Imgur = 'imgur',
	Wikipedia = 'wikipedia',
	Inaturalist = 'inaturalist',
	Flickr = 'flickr',
	Biolib = 'biolib',
	Bugguide = 'bugguide',
	Fishbase = 'fishbase',
	Ebird = 'ebird',
	ReptileDatabase = 'reptileDatabase',
	FishwisePro = 'fishwisePro',
	Shorefishes = 'shorefishes',
	Github = 'github',
	Pinterest = 'pinterest',
	Worms = 'worms',
	ReefLifeSurvey = 'reefLifeSurvey',
	Other = 'other'
}

export type PhotoSource = {
	name: PhotoSourceName
	text: string
	textEn?: string
	textVi?: string
}

export const photoSourcesMap: Record<PhotoSourceName, PhotoSource> = {
	imgur: {
		name: PhotoSourceName.Imgur,
		text: 'Imgur'
	},
	wikipedia: {
		name: PhotoSourceName.Wikipedia,
		text: 'Wikipedia'
	},
	inaturalist: {
		name: PhotoSourceName.Inaturalist,
		text: 'iNaturalist'
	},
	flickr: {
		name: PhotoSourceName.Flickr,
		text: 'Flickr'
	},
	biolib: {
		name: PhotoSourceName.Biolib,
		text: 'BioLib'
	},
	bugguide: {
		name: PhotoSourceName.Bugguide,
		text: 'BugGuide'
	},
	fishbase: {
		name: PhotoSourceName.Fishbase,
		text: 'FishBase'
	},
	ebird: {
		name: PhotoSourceName.Ebird,
		text: 'eBird'
	},
	reptileDatabase: {
		name: PhotoSourceName.ReptileDatabase,
		text: 'Reptile Database'
	},
	fishwisePro: {
		name: PhotoSourceName.FishwisePro,
		text: 'Fishwise Pro'
	},
	shorefishes: {
		name: PhotoSourceName.Shorefishes,
		text: 'Shorefishes'
	},
	github: {
		name: PhotoSourceName.Github,
		text: 'GitHub'
	},
	pinterest: {
		name: PhotoSourceName.Pinterest,
		text: 'Pinterest'
	},
	worms: {
		name: PhotoSourceName.Worms,
		text: 'WoRMS'
	},
	reefLifeSurvey: {
		name: PhotoSourceName.ReefLifeSurvey,
		text: 'Reef Life Survey'
	},
	other: {
		name: PhotoSourceName.Other,
		text: 'Other',
		textEn: 'Other',
		textVi: 'Khác'
	}
}
