import { useLocalStorageState, useResponsive, useVirtualList } from 'ahooks'
import {
	createContext,
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
	WheelEvent
} from 'react'
import { Panel } from './components/Panel'
import { PanelBar } from './components/PanelBar'
import { SplashScreen } from './components/SplashScreen'
import { TaxonNode } from './components/TaxonNode'
import './helpers/globalConfig'
import { parse, Taxon } from './helpers/parse'
import { useWindowSize } from './hooks/useWindowSize'
import { SubTaxaScroller } from './components/SubTaxaScroller'

type SetState<T> = Dispatch<SetStateAction<T>>

export type Panel = {
	name: string
	icon: string
	text: string
}

export type SubTaxa = {
	index: number
	data: Taxon
}

export type AppStore = {
	taxa: Taxon[]
	scrollTo: (index: number) => void
	panels: Panel[]
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
	const [scrollTop, setScrollTop] = useState<number>(
		Number(localStorage.getItem('taxon4:scrollTop')) || 0
	)

	const [subTaxa, scrollTo] = useVirtualList(taxa, {
		containerTarget: scrollerRef,
		wrapperTarget: subTaxaRef,
		itemHeight: lineHeight,
		overscan: linesOverscan
	})

	const [panels] = useState<Panel[]>([
		{
			name: 'ranks',
			icon: 'account_tree',
			text: 'Phân cấp'
		},
		{
			name: 'search',
			icon: 'search',
			text: 'Tìm kiếm'
		},
		{
			name: 'stats',
			icon: 'bar_chart',
			text: 'Thống kê'
		},
		{
			name: 'settings',
			icon: 'settings',
			text: 'Cài đặt'
		},
		{
			name: 'about',
			icon: 'info',
			text: 'Thông tin'
		}
	])
	const [currentPanel, setCurrentPanel] = useState<Panel>(panels[0])

	const store: AppStore = {
		taxa,
		scrollTo,
		panels,
		currentPanel,
		setCurrentPanel,
		subTaxa,
		linesOverscan,
		rankLevelWidth,
		scrollerRef,
		subTaxaRef,
		scrollTop,
		setScrollTop,
		lineHeight
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
		localStorage.setItem('taxon4:scrollTop', String(scrollTop))
	}, [scrollTop])

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
							<Panel />
						</div>

						<SubTaxaScroller />
					</div>
				)}
			</div>
		</AppContext.Provider>
	)
}
