import { Sites, useExtStore } from '../store/useExtStore'

/**
 * Trang hiện tại có phải trang soạn thảo sửa đổi trên Wikipedia không?
 *
 * Trang sửa đổi ví dụ:
 * https://vi.wikipedia.org/w/index.php?title=Nemateleotris_magnifica&veaction=edit.
 */
export function isWikipediaEdit(): boolean {
	const sites: Sites = useExtStore.getState().sites
	if (!sites.wikipedia) return false
	if (location.pathname !== '/w/index.php') return false

	const searchParams: URLSearchParams = new URLSearchParams(location.search)
	if (searchParams.get('action') === 'edit') return true
	if (searchParams.get('veaction') === 'edit') return true

	return false
}
