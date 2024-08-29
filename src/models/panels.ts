import { ReactNode } from 'react'
import { AboutPanel } from '../components/AboutPanel'
import { ClassificationPanel } from '../components/ClassificationPanel'
import { DebugPanel } from '../components/DebugPanel'
import { RanksPanel } from '../components/RanksPanel'
import { SearchPanel } from '../components/SearchPanel'
import { SettingsPanel } from '../components/SettingsPanel'

export type Panel = {
	name: string
	icon: string
	text: string
	component: () => ReactNode
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
		icon: 'trophy',
		text: 'Các bậc phân loại',
		component: RanksPanel
	},
	{
		name: 'stats',
		icon: 'finance',
		text: 'Thống kê',
		component: () => 'Chưa làm'
	},
	{
		name: 'settings',
		icon: 'settings',
		text: 'Cài đặt',
		component: SettingsPanel
	},
	{
		name: 'about',
		icon: 'info',
		text: 'Thông tin',
		component: AboutPanel
	}
]
