export type Panel = {
	name: string
	icon: string
	text: string
}

export const panels: Panel[] = [
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
]
