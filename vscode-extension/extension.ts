import {
	commands,
	Disposable,
	env,
	ExtensionContext,
	Position,
	Range,
	Selection,
	TextEditor,
	TextEditorRevealType
} from 'vscode'
import { HintLine, parseHintLines } from '../web-extension/helpers/hintLines'

async function taxon4FillHintLines(editor: TextEditor): Promise<void> {
	const copiedText: string = await env.clipboard.readText()
	const hintLines: HintLine[] = parseHintLines(copiedText)

	await env.clipboard.writeText('')
	if (hintLines.length === 0) return

	let insertedText: string = ''

	let position: Position = editor.selection.active
	editor.selection = new Selection(position, position)

	hintLinesLoop: for (const { lineNumber, textEn } of hintLines) {
		const textLine: string = editor.document.lineAt(lineNumber).text

		let colNumber: number
		do {
			colNumber = textLine.indexOf(' - /')
			if (colNumber >= 0) {
				colNumber += 3
				insertedText = textEn + ' '
				break
			}
			colNumber = textLine.indexOf(' - ')
			if (colNumber >= 0) {
				continue hintLinesLoop
			}
			colNumber = textLine.indexOf(' | ')
			if (colNumber >= 0) {
				insertedText = ' - ' + textEn
				break
			}
			colNumber = textLine.length
			insertedText = ' - ' + textEn
		} while (false)

		position = new Position(lineNumber, colNumber)
		editor.selection = new Selection(position, position)

		await editor.edit((edit): void => {
			edit.insert(position, insertedText)
		})

		position = position.translate(0, insertedText.length)
		editor.selection = new Selection(position, position)

		const range: Range = new Range(position, position)
		editor.revealRange(range, TextEditorRevealType.InCenterIfOutsideViewport)
	}
	// await editor.document.save()
}

export function activate(context: ExtensionContext): void {
	const taxon4FillHintLinesCommand: Disposable = commands.registerTextEditorCommand(
		'extension.taxon4.fillHintLines',
		taxon4FillHintLines
	)
	context.subscriptions.push(taxon4FillHintLinesCommand)
}
