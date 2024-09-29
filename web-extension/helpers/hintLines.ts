export type HintLine = {
	lineNumber: number
	textEn: string
}

const uniqueText: string = 'taxon4:hintLines:ikTG32AD5YR10OfDqxZ9n'

export function parseHintLines(text: string): HintLine[] {
	if (!text) return []
	if (!text.startsWith(uniqueText)) return []
	if (!text.endsWith(uniqueText)) return []

	text = text.slice(uniqueText.length, -uniqueText.length)
	if (!text) return []

	let hintLines: HintLine[] = []
	try {
		hintLines = JSON.parse(text)
	} catch {
		return []
	}
	if (!Array.isArray(hintLines)) return []

	return hintLines
}

export async function appendHintLineToClipboard(hintLine: HintLine): Promise<void> {
	let text: string = await navigator.clipboard.readText()
	const hintLines: HintLine[] = parseHintLines(text)
	const duplicatedHintLineIndex: number = hintLines.findIndex((hintLine2) => {
		return hintLine2.lineNumber === hintLine.lineNumber || hintLine2.textEn === hintLine.textEn
	})
	if (duplicatedHintLineIndex >= 0) {
		hintLines.splice(duplicatedHintLineIndex, 1)
	}
	hintLines.push(hintLine)

	text = JSON.stringify(hintLines)
	text = uniqueText + text + uniqueText
	await navigator.clipboard.writeText(text)
}
