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

export type Panel = {
	name: PanelName
	icon: string
	text: string
	component: (() => ReactNode) | NamedExoticComponent
}

export const panels: Panel[] = [
	{
		name: PanelName.Classification,
		icon: 'account_tree',
		text: 'Phân loại',
		component: ClassificationPanel
	},
	{
		name: PanelName.Search,
		icon: 'search',
		text: 'Tìm kiếm',
		component: SearchPanel
	},
	{
		name: PanelName.Ranks,
		icon: 'social_leaderboard',
		text: 'Các bậc phân loại',
		component: RanksPanel
	},
	{
		name: PanelName.Icons,
		icon: 'spa',
		text: 'Các biểu tượng',
		component: IconsPanel
	},
	{
		name: PanelName.ConservationStatuses,
		icon: 'book_4',
		text: 'Các tình trạng bảo tồn',
		component: ConservationStatusPanel
	},
	{
		name: PanelName.Stats,
		icon: 'finance',
		text: 'Thống kê',
		component: StatsPanel
	},
	{
		name: PanelName.Settings,
		icon: 'settings',
		text: 'Cài đặt',
		component: SettingsPanel
	},
	{
		name: PanelName.Help,
		icon: 'help_center',
		text: 'Hướng dẫn',
		component: HelpPanel
	},
	{
		name: PanelName.About,
		icon: 'info',
		text: 'Thông tin',
		component: AboutPanel
	}
]
