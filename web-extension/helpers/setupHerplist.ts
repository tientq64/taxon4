import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { setupStickySelection } from './setupStickySelection'

/** Hàm được gọi khi truy cập trang Herplist. */
export function setupHerplist() {
	const { sites } = ext

	if (!sites.herplist) return

	$('.species > i, .subspecies > i').addClass('sciname')
	$('.dotted-right').addClass('comname')
	$('.dotted-left')
		.filter((_, el) => {
			return /\b20(?:2[012345])\b/.test(el.innerText)
		})
		.addClass('new')
	$('h5, h4').html((_, html) => {
		const [sciname, comname] = html.split(' \u2013 ')
		return `${sciname} \u2013 <span class="comname">${comname}</span>`
	})

	setupStickySelection()
}
