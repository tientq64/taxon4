import { LanguageCode } from '../constants/languages'

/**
 * Trả về Wikipedia URL dựa trên chuỗi truy vấn và mã ngôn ngữ.
 *
 * @returns Wikipedia URL. Hoặc trả về chuỗi rỗng nếu chuỗi truy vẫn rỗng.
 */
export function getWikipediaUrlFromQuery(q: string, languageCode: LanguageCode): string {
	if (q.trim() === '') return ''

	return `https://${languageCode}.wikipedia.org/wiki/${q}`
}
