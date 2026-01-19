import { NamedExoticComponent, ReactNode } from 'react'
import { AboutPanel } from '../components/AboutPanel'
import { ClassificationPanel } from '../components/ClassificationPanel'
import { ConservationStatusPanel } from '../components/ConservationStatusPanel'
import { HelpPanel } from '../components/HelpPanel'
import { IconsPanel } from '../components/IconsPanel'
import { RanksPanel } from '../components/RanksPanel'
import { SearchPanel } from '../components/SearchPanel'
import { SettingsPanel } from '../components/SettingsPanel'
import { StatsPanel } from '../components/StatsPanel'

/** Tên của mục thanh bên trái màn hình. */
export const enum PanelName {
	Classification = 'classification',
	Search = 'search',
	RanksPanel = 'ranksPanel',
	Icons = 'icons',
	ConservationStatusesPanel = 'conservationStatusesPanel',
	Stats = 'stats',
	Settings = 'settings',
	Help = 'help',
	About = 'about'
}

/** Một mục ở thanh bên trái màn hình. */
export interface Panel {
	/** Tên mục. */
	name: PanelName

	/** Tên icon của mục. Dùng Material Icon. */
	icon: string

	/** Component nội dung của mục này khi được hiển thị. */
	component: (() => ReactNode) | NamedExoticComponent
}

export const panels: Panel[] = [
	{
		name: PanelName.Classification,
		icon: 'account_tree',
		component: ClassificationPanel
	},
	{
		name: PanelName.Search,
		icon: 'search',
		component: SearchPanel
	},
	{
		name: PanelName.RanksPanel,
		icon: 'tornado',
		component: RanksPanel
	},
	{
		name: PanelName.Icons,
		icon: 'raven',
		component: IconsPanel
	},
	{
		name: PanelName.ConservationStatusesPanel,
		icon: 'book_4',
		component: ConservationStatusPanel
	},
	{
		name: PanelName.Stats,
		icon: 'leaderboard',
		component: StatsPanel
	},
	{
		name: PanelName.Settings,
		icon: 'settings',
		component: SettingsPanel
	},
	{
		name: PanelName.Help,
		icon: 'help_center',
		component: HelpPanel
	},
	{
		name: PanelName.About,
		icon: 'info',
		component: AboutPanel
	}
]

/** Mục thanh bên mặc định. */
export const defaultPanel: Panel = panels[0]
