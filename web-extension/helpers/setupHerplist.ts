import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { setupStickySelection } from './setupStickySelection'

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

	setupStickySelection()
}
