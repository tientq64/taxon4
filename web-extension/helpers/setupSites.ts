import { forEach } from 'lodash-es'
import { ext } from '../store/ext'

/** Hàm được gọi cho từng trang web khi truy cập. */
export function setupSites(): void {
	const { sites } = ext

	forEach(sites, (matched, siteName): void => {
		if (!matched) return
		const siteClassName = `tx4-${siteName}`
		document.documentElement.classList.add(siteClassName)
	})
}
