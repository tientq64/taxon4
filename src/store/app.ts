import { proxy, Snapshot, useSnapshot } from 'valtio'
import { persist } from 'valtio-partial-persist'
import { defaultFontFace } from '../constants/fontFaces'
import { defaultLanguage, findLanguage, Language, LanguageCode } from '../constants/languages'
import { defaultPanel } from '../constants/panels'
import { lastRank } from '../constants/ranks'
import { SearchModeName } from '../constants/searchModes'
import { SearchTargetName } from '../constants/searchTargets'
import { Taxon } from '../helpers/parse'
import { ScrollToTaxon, VirtualTaxon } from '../pages/MainPage'

export interface AppStore {
	/** Danh sách tất cả các đơn vị phân loại. */
	taxa: Taxon[]

	/** Độ rộng thụt lề khi hiển thị các mục. */
	rankLevelWidth: number

	/** Vị trí cuộn hiện tại. */
	scrollTop: number

	/** Tên của mục đang được chọn trong thanh bên. */
	activePanelName: string

	/** Danh sách tất cả đơn vị phân loại đã được lọc theo cấp bậc giới hạn. */
	filteredTaxa: Taxon[]

	/** Đơn vị phân loại hiện tại đang được chọn trong trang xem. */
	activeTaxon: Taxon | undefined

	/** Chiều cao mục hiển thị đơn vị phân loại. */
	lineHeight: number

	/** Số lượng mục thêm vào đầu và cuối danh sách ảo. */
	linesOverscan: number

	/** Mã ngôn ngữ xác định ngôn ngữ hiện tại của ứng dụng. */
	languageCode: LanguageCode

	/** Bản ghi đếm số đơn vị phân loại theo bậc phân loại. */
	taxaCountByRankNames: Record<string, number>

	/** Cấp bậc phân loại tối đa được hiển thị. */
	maxRankLevelShown: number

	/** Phông chữ hiện tại của trang. */
	fontFaceFamily: string

	/** Cỡ chữ hiện tại của trang. */
	fontFaceSize: number

	/** Phím hiện tại đang được nhấn, là giá trị `event.code`. */
	keyCode: string

	/** Hiển thị danh sách với kẻ sọc không. */
	striped: boolean

	/** Đường kẻ thụt lề có đang được hiển thị trong giao diện không. */
	indentGuideVisible: boolean

	/** Bản đồ thu nhỏ có đang được hiển thị trong giao diện không. */
	minimapVisible: boolean

	/** Người dùng có bật chế độ nhà phát triển trong ứng dụng không. */
	developerModeEnabled: boolean

	/** Thanh tìm kiếm có đang hiển thị hay không. */
	isSearchPopupVisible: boolean

	/** Chuỗi tìm kiếm hiện tại. */
	searchValue: string

	/** Kết quả tìm kiếm hiện tại. */
	searchResult: Taxon[]

	/** Vị trí hiện tại trong kết quả tìm kiếm. */
	searchIndex: number

	/** Tìm kiếm phân biệt hoa/thường. */
	isSearchCaseSensitive: boolean

	/** Chế độ tìm kiếm. */
	searchModeName: SearchModeName

	/** Đối tượng tìm kiếm. */
	searchTargetName: SearchTargetName

	virtualTaxa: VirtualTaxon[]
	scrollToTaxon: ScrollToTaxon | undefined
}

const language: Language = findLanguage(navigator.language) ?? defaultLanguage

export const defaultApp: AppStore = {
	taxa: [],
	rankLevelWidth: 16,
	scrollTop: 0,
	activePanelName: defaultPanel.name,
	filteredTaxa: [],
	activeTaxon: undefined,
	lineHeight: 20,
	linesOverscan: 8,
	languageCode: language.code,
	taxaCountByRankNames: {},
	maxRankLevelShown: lastRank.level,
	fontFaceFamily: defaultFontFace.family,
	fontFaceSize: defaultFontFace.size,
	keyCode: '',
	striped: true,
	indentGuideVisible: true,
	minimapVisible: false,
	developerModeEnabled: false,
	isSearchPopupVisible: false,
	searchValue: '',
	searchResult: [],
	searchIndex: 0,
	isSearchCaseSensitive: false,
	searchModeName: SearchModeName.WholeWord,
	searchTargetName: SearchTargetName.All,
	virtualTaxa: [],
	scrollToTaxon: undefined
}

export const app = proxy<AppStore>(structuredClone(defaultApp))

export function useApp(sync?: boolean): Snapshot<AppStore> {
	return useSnapshot(app, { sync })
}

persist(app, 'tientq64/taxon4', [
	'scrollTop',
	'languageCode',
	'maxRankLevelShown',
	'fontFaceFamily',
	'striped',
	'indentGuideVisible',
	'minimapVisible',
	'developerModeEnabled',
	'activePanelName',
	'isSearchCaseSensitive',
	'searchModeName',
	'searchTargetName'
])
