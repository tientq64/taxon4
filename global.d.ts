namespace React {
	interface CSSProperties {
		objectViewBox?: string
	}
}

interface RegExpConstructor {
	/** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape */
	escape(str: string): string
}

/** @see https://developer.mozilla.org/en-US/docs/Web/API/Window/find */
function find(
	text?: string,
	caseSensitive?: boolean,
	backwards?: boolean,
	wrap?: boolean,
	wholeWord?: boolean,
	searchInFrames?: boolean,
	showDialog?: boolean
): boolean
