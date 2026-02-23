import { ext } from '../store/ext'
import { $ } from '../utils/jquery'

/** Hàm được gọi khi truy cập trang InfluentialPoints. */
export function setupInfluentialPoints(): void {
	const { sites } = ext

	if (!sites.influentialpoints) return

	$('h4:has(> i)').html((_, html) => {
		html = html.replace(/\((.+?)\)/, '<span class="comname">$1</span>')
		return html
	})
	$('.head h1').addClass('sciname')
	$('.head h2').addClass('comname')
}
