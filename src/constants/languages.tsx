/** Mã ngôn ngữ 2 ký tự. */
export enum LanguageCode {
	En = 'en',
	Vi = 'vi',
	Zh = 'zh',
	Ja = 'ja',
	Es = 'es'
}

// Export 2 mã ngôn ngữ chính của ứng dụng để tiện sử dụng.
export const { En, Vi } = LanguageCode

export interface Language {
	/** Mã ngôn ngữ gồm 2 ký tự. */
	code: LanguageCode

	/** Class Tailwind CSS định nghĩa màu nền và màu chữ cho ngôn ngữ. */
	colorClass: string

	/** Emoji quốc kỳ của ngôn ngữ. Là một React element. */
	emoji: string
}

/** Danh sách các ngôn ngữ được hỗ trợ trong ứng dụng. */
export const languages: Language[] = [
	{
		code: LanguageCode.En,
		colorClass: 'bg-blue-400 text-blue-950',
		emoji: '\u{1f1fa}\u{1f1f8}'
	},
	{
		code: LanguageCode.Vi,
		colorClass: 'bg-pink-400 text-pink-950',
		emoji: '\u{1f1fb}\u{1f1f3}'
	},
	{
		code: LanguageCode.Zh,
		colorClass: 'bg-rose-400 text-rose-950',
		emoji: '\u{1f1e8}\u{1f1f3}'
	},
	{
		code: LanguageCode.Ja,
		colorClass: 'bg-violet-400 text-violet-950',
		emoji: '\u{1f1ef}\u{1f1f5}'
	},
	{
		code: LanguageCode.Es,
		colorClass: 'bg-orange-400 text-orange-950',
		emoji: '\u{1f1ea}\u{1f1f8}'
	}
]

/** Ngôn ngữ mặc định của ứng dụng. */
export const defaultLanguage: Language = languages[0]

/**
 * Tìm ngôn ngữ theo mã ngôn ngữ.
 *
 * @param code Mã ngôn ngữ gồm 2 ký tự.
 * @returns Trả về đối tượng {@link Language} nếu tìm thấy, ngược lại trả về `undefined`.
 */
export function findLanguage(code: LanguageCode): Language
export function findLanguage(text: string): Language | undefined

export function findLanguage(code: string): Language | undefined {
	return languages.find((language) => language.code === code)
}
