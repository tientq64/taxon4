import { find } from 'lodash-es'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { lastRank } from '../../web-extension/constants/Ranks'
import { popupLanguages } from '../constants/popupLanguages'
import { Taxon } from '../helpers/parse'

export interface AppStore {
	/**
	 * Danh sách tất cả các đơn vị phân loại.
	 */
	taxa: Taxon[]
	setTaxa: (taxa: Taxon[]) => void

	/**
	 * Độ rộng thụt lề khi hiển thị các mục.
	 */
	rankLevelWidth: number
	setRankLevelWidth: (rankLevelWidth: number) => void

	/**
	 * Vị trí cuộn hiện tại.
	 */
	scrollTop: number
	setScrollTop: (scrollTop: number) => void

	/**
	 * Tên mục thanh bên hiện tại.
	 */
	currentPanelName: string
	setCurrentPanelName: (currentPanelName: string) => void

	/**
	 * Danh sách tất cả đơn vị phân loại đã được lọc theo cấp bậc giới hạn.
	 */
	filteredTaxa: Taxon[]
	setFilteredTaxa: (filteredTaxa: Taxon[]) => void

	/**
	 * Đơn vị phân loại hiện tại được chọn trong trang xem.
	 */
	currentTaxon: Taxon | undefined
	setCurrentTaxon: (currentTaxon: Taxon | undefined) => void

	/**
	 * Chiều cao mục hiển thị đơn vị phân loại.
	 */
	lineHeight: number

	/**
	 * Số lượng mục thêm vào đầu và cuối danh sách ảo.
	 */
	linesOverscan: number

	/**
	 * Mã ngôn ngữ xác định ngôn ngữ hiển thị trong popup chi tiết đơn vị phân loại.
	 */
	popupLanguageCode: string
	setPopupLanguageCode: (popupLanguageCode: string) => void

	/**
	 * Bản ghi đếm số đơn vị phân loại theo bậc phân loại.
	 */
	taxaCountByRankNames: Record<string, number>
	setTaxaCountByRankNames: (taxaCountByRankNames: Record<string, number>) => void

	/**
	 * Cấp bậc phân loại tối đa được hiển thị.
	 */
	maxRankLevelShown: number
	setMaxRankLevelShown: (maxRankLevelShown: number) => void

	/**
	 * Phím hiện tại đang được nhấn, là giá trị `event.code`.
	 */
	keyCode: string
	setKeyCode: (keyCode: string) => void

	/**
	 * Hiển thị danh sách với kẻ sọc không?
	 */
	striped: boolean
	setStriped: (striped: boolean) => void

	/**
	 * Hiển thị đường kẻ thụt lề không?
	 */
	indentGuideShown: boolean
	setIndentGuideShown: (indentGuideShown: boolean) => void

	/**
	 * Hiển thị bản đồ thu nhỏ không?
	 */
	minimapShown: boolean
	setMinimapShown: (minimapShown: boolean) => void

	/**
	 * Là chế độ nhà phát triển?
	 */
	isDev: boolean
	setIsDev: (isDev: boolean) => void

	/**
	 * Thanh tìm kiếm có đang hiển thị hay không?
	 */
	isSearchPopupShown: boolean
	setIsSearchPopupShown: (isSearchPopupShown: boolean) => void
}

export const useAppStore = create<AppStore, [['zustand/persist', Partial<AppStore>]]>(
	persist(
		(set) => ({
			taxa: [],
			setTaxa: (taxa) => set({ taxa }),

			rankLevelWidth: 16,
			setRankLevelWidth: (rankLevelWidth) => set({ rankLevelWidth }),

			scrollTop: 0,
			setScrollTop: (scrollTop) => set({ scrollTop }),

			currentPanelName: 'classification',
			setCurrentPanelName: (currentPanelName) => set({ currentPanelName }),

			filteredTaxa: [],
			setFilteredTaxa: (filteredTaxa) => set({ filteredTaxa }),

			currentTaxon: undefined,
			setCurrentTaxon: (currentTaxon) => set({ currentTaxon }),

			lineHeight: 24,
			linesOverscan: 8,

			popupLanguageCode: find(popupLanguages, { code: navigator.language })?.code ?? 'en',
			setPopupLanguageCode: (popupLanguageCode) => set({ popupLanguageCode }),

			taxaCountByRankNames: {},
			setTaxaCountByRankNames: (taxaCountByRankNames) => set({ taxaCountByRankNames }),

			maxRankLevelShown: lastRank.level,
			setMaxRankLevelShown: (maxRankLevelShown) => set({ maxRankLevelShown }),

			keyCode: '',
			setKeyCode: (keyCode) => set({ keyCode }),

			striped: true,
			setStriped: (striped) => set({ striped }),

			indentGuideShown: true,
			setIndentGuideShown: (indentGuideShown) => set({ indentGuideShown }),

			minimapShown: true,
			setMinimapShown: (minimapShown) => set({ minimapShown }),

			isDev: false,
			setIsDev: (isDev) => set({ isDev }),

			isSearchPopupShown: false,
			setIsSearchPopupShown: (isSearchPopupShown) => set({ isSearchPopupShown })
		}),
		{
			name: 'tientq64/taxon4',
			partialize: (state) => ({
				scrollTop: state.scrollTop,
				popupLanguageCode: state.popupLanguageCode,
				maxRankLevelShown: state.maxRankLevelShown,
				striped: state.striped,
				indentGuideShown: state.indentGuideShown,
				minimapShown: state.minimapShown,
				isDev: state.isDev,
				currentPanelName: state.currentPanelName
			})
		}
	)
)
