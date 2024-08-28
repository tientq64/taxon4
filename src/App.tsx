import { useResponsive, useVirtualList } from 'ahooks'
import {
	createContext,
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'
import { LanguageFloatingButton } from './components/LanguageFloatingButton'
import { PanelBar } from './components/PanelBar'
import { Panels } from './components/Panels'
import { SplashScreen } from './components/SplashScreen'
import { SubTaxaScroller } from './components/SubTaxaScroller'
import './helpers/globalConfig'
import { parse, Taxon } from './helpers/parse'
import { useWindowSize } from './hooks/useWindowSize'
import { Panel, panels } from './models/panels'
import { popupLanguages } from './models/popupLanguages'
import { useLocalStorageState } from './hooks/useLocalStorageState'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type SubTaxa = {
	index: number
	data: Taxon
}

export type AppStore = {
	taxa: Taxon[]
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

	const store: AppStore = {
		taxa,
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
		setPopupLanguageCode
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

	useEffect(() => {
		fetch('data/data.taxon4')
			.then((res: Response) => res.text())
			.then((text: string) => {
				const newTaxa: Taxon[] = parse(text)
				setTaxa(newTaxa)
			})
	}, [])

	return (
		<AppContext.Provider value={store}>
			<div className="h-full">
				{taxa.length === 0 && <SplashScreen />}

				{taxa.length > 0 && (
					<div className="flex h-full">
						<div className="flex">
							<PanelBar />
							<Panels />
						</div>

						<SubTaxaScroller />
						<LanguageFloatingButton />
					</div>
				)}
			</div>
		</AppContext.Provider>
	)
}
