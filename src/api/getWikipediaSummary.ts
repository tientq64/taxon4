import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'
import { app } from '../store/app'
import { parseHtml } from '../utils/parseHtml'

/**
 * Lấy văn bản tóm tắt mô tả từ Wikipedia.
 *
 * @param taxonOrQueryOrUrl Đơn vị phân loại, chuỗi truy vấn tìm kiếm hoặc URL cần lấy dữ
 *   liệu.
 * @param languageCode Ngôn ngữ của dữ liệu cần lấy, là mã định dạng 2 ký tự. Mặc định là
 *   ngôn ngữ hiện tại của ứng dụng.
 * @param includeTitle Có bao gồm HTML tiêu đề hay không? Được dùng khi userscript lấy dữ
 *   liệu tiếng Việt để hiển thị ở thanh bên phải trên các trang Wikipedia.
 * @returns Văn bản tóm tắt mô tả ở định dạng HTML, hoặc `null` nếu không tìm thấy hoặc có
 *   bất kỳ lỗi nào.
 */
export async function getWikipediaSummary(
	taxonOrQueryOrUrl: Taxon | string,
	languageCode: string = app.languageCode,
	includeTitle: boolean = false
): Promise<string | null> {
	let q: string
	if (typeof taxonOrQueryOrUrl === 'string') {
		q = taxonOrQueryOrUrl.replace(/^https:\/\/[a-z]{2}\.wikipedia\.org\/wiki\/(.+)$/, '$1')
	} else {
		q = getTaxonWikipediaQueryName(taxonOrQueryOrUrl, languageCode)
	}
	if (q === '/') return null

	const apiUrl: string = `https://${languageCode}.wikipedia.org/api/rest_v1/page/summary/${q}`
	const res: Response = await fetch(apiUrl, {
		headers: fetchHeaders
	})
	if (!res.ok) return null

	const data: any = await res.json()
	let summary: string = data.extract_html
	if (summary === undefined) return null

	const dom: Document = parseHtml(summary)
	const paragraphEl = dom.querySelector<HTMLParagraphElement>('p')
	const shouldRemoveEls = dom.querySelectorAll<HTMLSpanElement>('span.tfd')
	for (const el of shouldRemoveEls) {
		el.remove()
	}
	if (paragraphEl === null) return null

	summary = paragraphEl.innerHTML
	summary = summary.replace(/:$/, '.')

	if (includeTitle) {
		const title: string = data.title
		summary = `<div class="taxon4-title mb-4 border-b border-gray-500 font-serif text-2xl!">${title}</div>${summary}`
	}

	return summary
}
