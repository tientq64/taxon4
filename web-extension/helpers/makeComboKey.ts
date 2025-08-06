import { lowerFirst } from 'lodash-es'
import { Dict } from '../../src/types/common'

const keyMap: Dict = {
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

/**
 * Trả về một phím trong combo phím.
 *
 * @example
 * 	makeComboKey('KeyA') // 'a'
 * 	makeComboKey('ArrowLeft') // 'left'
 * 	makeComboKey('Semicolon') // ';'
 * 	makeComboKey('Escape') // 'esc'
 * 	makeComboKey('ControlRight') // 'ctrl'
 * 	makeComboKey(0) // 'ml'
 *
 * @param code Code của phím trong `event.code`, hoặc nút chuột trong `event.button`.
 * @returns Một phím trong combo phím.
 */
export function makeComboKey(code: string | number): string {
	code = String(code)

	const key = keyMap[code]
	if (key) return key

	if (/^Key[A-Z]$/.test(code)) {
		return code.substring(3).toLowerCase()
	}
	if (/^Digit[0-9]$/.test(code)) {
		return code.substring(5)
	}
	if (/^Arrow(?:Up|Down|Left|Right)$/.test(code)) {
		return code.substring(5).toLowerCase()
	}
	return lowerFirst(code)
}
