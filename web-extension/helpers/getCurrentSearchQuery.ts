import { ext } from '../store/ext'
import { $ } from '../utils/jquery'

/**
 * Cố gắng lấy tên khoa học theo dạng chuỗi truy vấn tìm kiếm của đơn vị phân loại xác
 * định trên trang web hiện tại. Chuỗi truy vấn này được dùng để điều hướng giữa các trang
 * web khác nhau.
 */
export function getCurrentSearchQuery(): string | undefined {
	const { sites } = ext

	let q: string | undefined
	switch (true) {
		case sites.wikipedia:
			q = $('.biota .binomial').first().clone().find('.reference').remove().end().text()
			q ||= $('.biota .selflink').first().text()
			q ||= $('#firstHeading > i').first().text()
			break

		case sites.wikispecies:
			q = $<HTMLAnchorElement>('.wb-otherproject-species > a').attr('href')?.split('/').at(-1)
			break

		case sites.flickr:
			q = $<HTMLInputElement>('#search-field').val()
			break

		case sites.inaturalistSearch:
			q = $<HTMLInputElement>('#q').val()
			break

		case sites.inaturalistTaxon:
			q = $('#TaxonHeader .sciname').clone().children('.rank').remove().end().text()
			break

		case sites.herplist:
			{
				const url = performance.getEntriesByType('navigation').at(0)?.name
				if (!url) break
				q = url.replace(/^.+:~:text=/, '')
			}
			break

		case sites.repfocus:
			q = location.pathname.split('/').at(-1)?.split('.').at(0)
			break

		case sites.ebird:
			q = $('.Heading-sub--sci').text()
			break

		case sites.googleImage:
			q = $<HTMLTextAreaElement>('textarea[name=q]').val()
			break

		case sites.sealifebase:
			q = $<HTMLElement>('.pheader > i').text()
			break
	}
	if (!q) return

	q = encodeURI(q.trim())
	return q
}
