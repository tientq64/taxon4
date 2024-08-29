import { useResponsive, useVirtualList } from 'ahooks'
import { countBy } from 'lodash-es'
import {
	createContext,
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import { Ranks } from '../web-extension/models/Ranks'
import { LanguageFloatingButton } from './components/LanguageFloatingButton'
import { PanelsSide } from './components/PanelsSide'
import { TaxaLoader } from './components/TaxaLoader'
import { SubTaxaScroller } from './components/SubTaxaScroller'
import './helpers/globalConfig'
import { parse, Taxon } from './helpers/parse'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useWindowSize } from './hooks/useWindowSize'
import { Panel, panels } from './models/panels'
import { popupLanguages } from './models/popupLanguages'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type SubTaxa = {
	index: number
	data: Taxon
}

export type AppStore = {
	taxa: Taxon[]
	setTaxa: SetState<Taxon[]>
	scrollTo: (index: number) => void
	currentPanel: Panel
	setCurrentPanel: SetState<Panel>
	subTaxa: SubTaxa[]
	linesOverscan: number
	rankLevelWidth: number
	scrollerRef: RefObject<HTMLDivElement>
	subTaxaRef: RefObject<HTMLDivElement>
	scrollTop: number
	setScrollTop: SetState<number>
	lineHeight: number
	popupLanguageCode: string
	setPopupLanguageCode: SetState<string>
	taxaCountByRankNames: Record<string, number>
}

export const AppContext = createContext<AppStore | null>(null)

export function App() {
	const [rankLevelWidth, setRankLevelWidth] = useState<number>(16)
	const [lineHeight] = useState<number>(24)
	const [linesOverscan] = useState<number>(10)
	const [taxa, setTaxa] = useState<Taxon[]>([])
	const scrollerRef = useRef<HTMLDivElement>(null)
	const subTaxaRef = useRef<HTMLDivElement>(null)
	const responsive = useResponsive()
	const [windowWidth] = useWindowSize()
	const [currentPanel, setCurrentPanel] = useState<Panel>(panels[0])
	const [scrollTop, setScrollTop] = useLocalStorageState<number>('scrollTop', 0)
	const [popupLanguageCode, setPopupLanguageCode] = useLocalStorageState<string>(
		'popupLanguageCode',
		popupLanguages[0].code
	)

	const [subTaxa, scrollTo] = useVirtualList(taxa, {
		containerTarget: scrollerRef,
		wrapperTarget: subTaxaRef,
		itemHeight: lineHeight,
		overscan: linesOverscan
	})

	const taxaCountByRankNames = useMemo<Record<string, number>>(() => {
		const counts: Record<string, number> = countBy(taxa, 'rank.name')
		for (const rank of Ranks) {
			if (counts[rank.name] === undefined) {
				counts[rank.name] = 0
			}
		}
		return counts
	}, [taxa])

	const store: AppStore = {
		taxa,
		setTaxa,
		scrollTo,
		currentPanel,
		setCurrentPanel,
		subTaxa,
		linesOverscan,
		rankLevelWidth,
		scrollerRef,
		subTaxaRef,
		scrollTop,
		setScrollTop,
		lineHeight,
		popupLanguageCode,
		setPopupLanguageCode,
		taxaCountByRankNames
	}

	useEffect(() => {
		if (responsive.xxl) {
			setRankLevelWidth(16)
		} else if (responsive.xl) {
			setRankLevelWidth(8)
		} else if (responsive.lg) {
			setRankLevelWidth(4)
		} else {
			setRankLevelWidth(0)
		}
	}, [windowWidth])

	return (
		<AppContext.Provider value={store}>
			<div className="h-full">
				{taxa.length === 0 && <TaxaLoader />}

				{taxa.length > 0 && (
					<div className="flex h-full">
						<PanelsSide />
						<SubTaxaScroller />
						<LanguageFloatingButton />
					</div>
				)}
			</div>
		</AppContext.Provider>
	)
}
