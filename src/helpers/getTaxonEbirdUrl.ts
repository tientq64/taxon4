export interface EbirdSearchResultItem {
	code: string
	name: string
}

const apiBaseUrl: string = 'https://api.ebird.org/v2/ref/taxon/find'

/**
 * Tìm và trả về Ebird URL của đơn vị phân loại.
 *
 * @param q
 * @returns Ebird URL nếu tìm thấy, còn không trả về chuỗi trống.
 */
export async function getTaxonEbirdUrl(q: string): Promise<string | undefined> {
	const apiUrl: string = `${apiBaseUrl}?cat=species&key=jfekjedvescr&q=${q}`

	const res: Response = await fetch(apiUrl)
	const items: EbirdSearchResultItem[] = await res.json()

	const taxonName: string = decodeURIComponent(q).toLowerCase()
	let foundItem: EbirdSearchResultItem | undefined = items.find((item) => {
		item.name.toLowerCase().includes(taxonName)
	})
	foundItem ??= items.at(0)
	if (foundItem === undefined) return

	return `https://ebird.org/species/${foundItem.code}`
}
