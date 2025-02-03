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

export type Panel = {
	name: string
	icon: string
	text: string
	component: (() => ReactNode) | NamedExoticComponent
}

export const panels: Panel[] = [
	{
		name: 'classification',
		icon: 'account_tree',
		text: 'Phân loại',
		component: ClassificationPanel
	},
	{
		name: 'search',
		icon: 'search',
		text: 'Tìm kiếm',
		component: SearchPanel
	},
	{
		name: 'ranks',
		icon: 'social_leaderboard',
		text: 'Các bậc phân loại',
		component: RanksPanel
	},
	{
		name: 'icons',
		icon: 'spa',
		text: 'Các biểu tượng',
		component: IconsPanel
	},
	{
		name: 'conservationStatuses',
		icon: 'book_4',
		text: 'Các tình trạng bảo tồn',
		component: ConservationStatusPanel
	},
	{
		name: 'stats',
		icon: 'finance',
		text: 'Thống kê',
		component: StatsPanel
	},
	{
		name: 'settings',
		icon: 'settings',
		text: 'Cài đặt',
		component: SettingsPanel
	},
	{
		name: 'help',
		icon: 'help_center',
		text: 'Hướng dẫn',
		component: HelpPanel
	},
	{
		name: 'about',
		icon: 'info',
		text: 'Thông tin',
		component: AboutPanel
	}
]
