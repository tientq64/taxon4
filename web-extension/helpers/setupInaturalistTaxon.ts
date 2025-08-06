import { ext } from '../store/ext'
import { $ } from '../utils/jquery'

/** Hàm được gọi khi truy cập trang chi tiết về đơn vị phân loại xác định của iNaturalist. */
export function setupInaturalistTaxon(): void {
	const { sites } = ext

	if (!sites.inaturalistTaxon) return

	const taxonomyLink = document.querySelector<HTMLAnchorElement>(
		'#main-tabs > li:not(.active) > a[href="#taxonomy-tab"]'
	)
	if (taxonomyLink) {
		taxonomyLink.click()
	}

	const removeOtherCommonNames = (countdown: number): void => {
		if (countdown === 0) return

		const el = document.querySelector<HTMLElement>('.TaxonomyTab .row:nth-child(2) .col-xs-8')
		if (el === null) return

		const tds = el.querySelectorAll<HTMLTableCellElement>('tr > td:first-child')
		if (tds.length === 0) {
			window.setTimeout(removeOtherCommonNames, 100, countdown - 1)
			return
		}

		let count: number = tds.length
		for (const td of tds) {
			if (td.textContent === 'English' || td.textContent === 'Vietnamese') continue
			td.parentElement!.hidden = true
			count--
		}
		if (count === 0) {
			$(el).append('<i class="p-2">Không có tên tiếng Anh hoặc tiếng Việt.</i>')
		}
	}
	removeOtherCommonNames(10)

	const photoLinks = document.querySelectorAll<HTMLAnchorElement>('.PhotoPreview a.photoItem')
	for (const photoLink of photoLinks) {
		const image = new Image()
		image.src = photoLink.href.replace('/square.', '/large.')
	}

	$('.TaxonomicBranch a.comname').replaceWith((_, innerHtml) => {
		return innerHtml
	})
}
