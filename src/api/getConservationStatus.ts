import {
	ConservationStatus,
	conservationStatuses,
	conservationStatusesMap
} from '../constants/conservationStatuses'
import { wikipediaFetchHeaders } from '../constants/wikipediaFetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'

/**
 * Lấy tình trạng bảo tồn của một đơn vị phân loại từ Wikipedia.
 *
 * FIXME: Hiện tại, API lấy media list của Wikipedia trả về trường items là mảng trống, có
 * thể là lỗi tạm thời, nên kết quả hiện tại luôn trả về NE, cần kiểm tra lại sau.
 *
 * @param taxon Đơn vị phân loại cần lấy tình trạng bảo tồn.
 * @returns Một Promise trả về đối tượng ConservationStatus nếu tìm thấy, hoặc null nếu
 *   không tìm thấy.
 * @throws Lỗi nếu có vấn đề trong quá trình truy xuất dữ liệu từ Wikipedia.
 */
export async function getConservationStatus(taxon: Taxon): Promise<ConservationStatus | null> {
	const q = getTaxonWikipediaQueryName(taxon, 'en')
	const { NE, DD } = conservationStatusesMap

	const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${q}`
	const res = await fetch(apiUrl, {
		headers: wikipediaFetchHeaders
	})
	if (!res.ok) return NE

	const data = await res.json()
	if (data.items === undefined) return NE

	const item = data.items.find((item2: any) => {
		return item2.title.startsWith('File:Status_iucn')
	})
	if (item === undefined) return NE

	for (const status of conservationStatuses) {
		if (item.title.includes(status.name)) {
			return status
		}
	}
	return DD
}
