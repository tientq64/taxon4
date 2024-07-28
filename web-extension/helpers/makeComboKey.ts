import { lowerFirst } from 'lodash-es'

const keyMap: Record<string, string> = {
	Backquote: '`',
	Minus: '-',
	Equal: '=',
	BracketLeft: '[',
	BracketRight: ']',
	Semicolon: ';',
	Quote: "'",
	Backslash: '\\',
	Comma: ',',
	Period: '.',
	Slash: '/',
	NumpadEnter: 'enter',
	Escape: 'esc',
	Backspace: 'backsp',
	ControlLeft: 'ctrl',
	ControlRight: 'ctrl',
	ShiftLeft: 'shift',
	ShiftRight: 'shift',
	AltLeft: 'alt',
	AltRight: 'alt',
	0: 'ml',
	1: 'mm',
	2: 'mr'
}

export function makeComboKey(code: string | number): string {
	code = String(code)

	const key: string | undefined = keyMap[code]
	if (key) return key

	if (/^Key[A-Z]$/.test(code)) return code.substring(3).toLowerCase()
	if (/^Digit[0-9]$/.test(code)) return code.substring(5)
	if (/^Arrow(?:Up|Down|Left|Right)$/.test(code)) return code.substring(5).toLowerCase()

	return lowerFirst(code)
}
