import { findIndex } from 'lodash-es'

export type HintLine = {
	lineNumber: number
	textEn: string
}

const signature: string = 'taxon4:hintLines:ikTG32AD5YR10OfDqxZ9n'

export function parseHintLines(text: string): HintLine[] {
	if (!text) return []
	if (!text.startsWith(signature)) return []
	if (!text.endsWith(signature)) return []

	text = text.slice(signature.length, -signature.length)
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
	const duplicatedHintLineIndex: number = findIndex(hintLines, {
		lineNumber: hintLine.lineNumber,
		textEn: hintLine.textEn
	})
	if (duplicatedHintLineIndex >= 0) {
		hintLines.splice(duplicatedHintLineIndex, 1)
	}
	hintLines.push(hintLine)

	text = JSON.stringify(hintLines)
	text = signature + text + signature
	await navigator.clipboard.writeText(text)
}
