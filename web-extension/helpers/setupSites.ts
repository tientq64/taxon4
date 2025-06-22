import { forEach } from 'lodash-es'
import { ext } from '../store/ext'

export function setupSites(): void {
	const { sites } = ext

	forEach(sites, (matched: boolean, siteName: string): void => {
		if (!matched) return
		document.documentElement.classList.add(`tx4-${siteName}`)
	})
}
