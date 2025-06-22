import { ext } from '../store/ext'

export function setupInaturalistSearch(): void {
	const { sites } = ext

	if (!sites.inaturalistSearch) return

	const searchParams: URLSearchParams = new URLSearchParams(location.search)
	if (searchParams.has('isCommonName')) {
		const link = document.querySelector<HTMLAnchorElement>('.taxon_list_taxon > h3 > a')!
		link?.click()
	}
}
