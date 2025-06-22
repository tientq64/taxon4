import { proxy, Snapshot, useSnapshot } from 'valtio'
import { persist } from 'valtio-partial-persist'
import { lastRank } from '../../web-extension/constants/Ranks'
import { defaultFontFace } from '../constants/fontFaces'
import { defaultLanguage, findLanguage, Language, LanguageCode } from '../constants/languages'
import { defaultPanel } from '../constants/panels'
import { Taxon } from '../helpers/parse'
import { ScrollToTaxon, SubTaxon } from '../pages/MainPage'

export interface AppStore {
	/** Danh sách tất cả các đơn vị phân loại. */
	taxa: Taxon[]

	/** Độ rộng thụt lề khi hiển thị các mục. */
	rankLevelWidth: number

	/** Vị trí cuộn hiện tại. */
	scrollTop: number

	/** Tên mục thanh bên hiện tại. */
	currentPanelName: string

	/** Danh sách tất cả đơn vị phân loại đã được lọc theo cấp bậc giới hạn. */
	filteredTaxa: Taxon[]

	/** Đơn vị phân loại hiện tại được chọn trong trang xem. */
	currentTaxon: Taxon | undefined

	/** Chiều cao mục hiển thị đơn vị phân loại. */
	lineHeight: number

	/** Số lượng mục thêm vào đầu và cuối danh sách ảo. */
	linesOverscan: number

	/** Mã ngôn ngữ xác định ngôn ngữ của ứng dụng. */
	languageCode: LanguageCode

	/** Mã ngôn ngữ xác định ngôn ngữ hiển thị trong popup chi tiết đơn vị phân loại. */
	popupLanguageCode: LanguageCode

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

	/** Hiển thị danh sách với kẻ sọc không? */
	striped: boolean

	/** Hiển thị đường kẻ thụt lề không? */
	indentGuideShown: boolean

	/** Hiển thị bản đồ thu nhỏ không? */
	minimapShown: boolean

	/** Là chế độ nhà phát triển? */
	isDev: boolean

	/** Thanh tìm kiếm có đang hiển thị hay không? */
	isSearchPopupVisible: boolean

	subTaxa: SubTaxon[]
	scrollToTaxon: ScrollToTaxon | undefined
}

const language: Language = findLanguage(navigator.language) ?? defaultLanguage

export const defaultApp: AppStore = {
	taxa: [],
	rankLevelWidth: 16,
	scrollTop: 0,
	currentPanelName: defaultPanel.name,
	filteredTaxa: [],
	currentTaxon: undefined,
	lineHeight: 20,
	linesOverscan: 8,
	languageCode: language.code,
	popupLanguageCode: language.code,
	taxaCountByRankNames: {},
	maxRankLevelShown: lastRank.level,
	fontFaceFamily: defaultFontFace.family,
	fontFaceSize: defaultFontFace.size,
	keyCode: '',
	striped: true,
	indentGuideShown: true,
	minimapShown: false,
	isDev: false,
	isSearchPopupVisible: false,
	subTaxa: [],
	scrollToTaxon: undefined
}

export const app = proxy<AppStore>(structuredClone(defaultApp))

export function useApp(): Snapshot<AppStore> {
	return useSnapshot(app)
}

persist(app, 'tientq64/taxon4', [
	'scrollTop',
	'languageCode',
	'popupLanguageCode',
	'maxRankLevelShown',
	'fontFaceFamily',
	'striped',
	'indentGuideShown',
	'minimapShown',
	'isDev',
	'currentPanelName'
])
