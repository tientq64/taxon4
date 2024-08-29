export class ParseError extends Error {
	name: string = 'ParseError'
	line: string
	ln: number

	constructor(message: string, line: string, ln: number = 0) {
		super(message)
		this.line = line
		this.ln = ln
	}

	override toString(): string {
		return this.message
	}
}
