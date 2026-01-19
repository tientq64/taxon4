/** Tên của nguồn hình ảnh. */
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
	Imgbb = 'imgbb',
	Other = 'other'
}

/** Nguồn của một hình ảnh. */
export type PhotoSource = {
	/** Tên nguồn hình ảnh. */
	name: PhotoSourceName

	/** Tên hiển thị của nguồn hình ảnh. */
	text: string

	/** Tên hiển thị của nguồn hình ảnh bằng tiếng Anh. */
	textEn?: string

	/** Tên hiển thị của nguồn hình ảnh bằng tiếng Việt. */
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
	imgbb: {
		name: PhotoSourceName.Imgbb,
		text: 'Imgbb'
	},
	other: {
		name: PhotoSourceName.Other,
		text: 'Other',
		textEn: 'Other',
		textVi: 'Khác'
	}
}
