import { Sites, useExtStore } from '../store/useExtStore'

export function isWikipediaEdit(): boolean {
	const sites: Sites = useExtStore.getState().sites
	if (!sites.wikipedia) return false
	if (location.pathname !== '/w/index.php') return false

	const searchParams: URLSearchParams = new URLSearchParams(location.search)
	if (searchParams.get('action') !== 'edit') return false

	return true
}
