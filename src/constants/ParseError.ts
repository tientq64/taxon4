/** Đại diện cho một lỗi khi phân tích cú pháp tệp `.taxon`. */
export class ParseError extends Error {
	name: string = 'ParseError'

	/** Đoạn code bị lỗi. */
	line: string

	/** Số dòng nơi đoạn code bị lỗi. */
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
