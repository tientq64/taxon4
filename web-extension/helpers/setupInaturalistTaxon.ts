import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { setupInaturalist } from './setupInaturalist'

/** Hàm được gọi khi truy cập trang chi tiết về đơn vị phân loại xác định của iNaturalist. */
export function setupInaturalistTaxon(): void {
	const isContinue = setupInaturalist()
	if (!isContinue) return

	const { sites } = ext

	if (!sites.inaturalistTaxon) return

	$('#main-tabs > li:not(.active) > a[href="#taxonomy-tab"]').first().click()

	/**
	 * Loại bỏ các tên thông thường khác không phải tiếng Anh hoặc tiếng Việt trong danh
	 * sách.
	 *
	 * @param countdown Số lần thử, đếm ngược nếu về 0 sẽ dừng lại.
	 */
	const removeOtherCommonNames = (countdown: number): void => {
		if (countdown === 0) return

		const $el = $('.TaxonomyTab .row:nth-child(2) .col-xs-8')
		if ($el.length === 0) return

		// Dò xem danh sách tên thông thường đã xuất hiện chưa. Nếu chưa thì đợi 100ms rồi thực hiện lại.
		const $tds = $el.find<HTMLTableCellElement>('tr > td:first-child')
		if ($tds.length === 0) {
			window.setTimeout(removeOtherCommonNames, 100, countdown - 1)
			return
		}

		let count: number = $tds.length
		for (const td of $tds) {
			if (td.textContent === 'English' || td.textContent === 'Vietnamese') continue
			td.parentElement!.hidden = true
			count--
		}
		if (count === 0) {
			$el.append('<i class="p-2">Không có tên tiếng Anh hoặc tiếng Việt.</i>')
		}
	}
	removeOtherCommonNames(10)

	$<HTMLAnchorElement>('.PhotoPreview a.photoItem').each((_, photoLink) => {
		const image = new Image()
		image.src = photoLink.href.replace('/square.', '/large.')
	})

	$('.TaxonomicBranch a.comname').replaceWith((_, innerHtml) => innerHtml)
}
