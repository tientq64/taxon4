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

export const enum PanelName {
	Classification = 'classification',
	Search = 'search',
	Ranks = 'ranks',
	Icons = 'icons',
	ConservationStatuses = 'conservationStatuses',
	Stats = 'stats',
	Settings = 'settings',
	Help = 'help',
	About = 'about'
}

export interface Panel {
	name: PanelName
	icon: string
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
		name: PanelName.Ranks,
		icon: 'tornado',
		component: RanksPanel
	},
	{
		name: PanelName.Icons,
		icon: 'raven',
		component: IconsPanel
	},
	{
		name: PanelName.ConservationStatuses,
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

export const defaultPanel: Panel = panels[0]
