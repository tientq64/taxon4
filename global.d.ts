interface Event {
	redraw?: boolean
}

namespace React {
	interface CSSProperties {
		objectViewBox?: string
	}
}

function find(
	text?: string,
	caseSensitive?: boolean,
	backwards?: boolean,
	wrap?: boolean,
	wholeWord?: boolean,
	searchInFrames?: boolean,
	showDialog?: boolean
): boolean
