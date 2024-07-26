import { commands, ExtensionContext, Disposable, TextEditor, TextEditorEdit, window } from 'vscode'

function taxonTest(editor: TextEditor, edit: TextEditorEdit): void {
	window.showInformationMessage('haha')
}

export function activate(context: ExtensionContext): void {
	const taxonTestCommand: Disposable = commands.registerTextEditorCommand(
		'extension.taxonTest',
		taxonTest
	)
	context.subscriptions.push(taxonTestCommand)
}
