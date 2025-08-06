import { ext } from '../store/ext'

/** Hàm được gọi khi truy cập trang kết quả tìm kiếm của iNaturalist. */
export function setupInaturalistSearch(): void {
	const { sites } = ext

	if (!sites.inaturalistSearch) return

	const searchParams = new URLSearchParams(location.search)
	if (searchParams.has('isCommonName')) {
		const link = document.querySelector<HTMLAnchorElement>('.taxon_list_taxon > h3 > a')
		link?.click()
	}
}
