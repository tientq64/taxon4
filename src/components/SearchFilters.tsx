import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { searchModes } from '../constants/searchModes'
import { app, useApp } from '../store/app'
import { Select } from './Select'
import { Switch } from './Switch'

export function SearchFilters(): ReactNode {
	const { isSearchCaseSensitive, searchModeName } = useApp()
	const { t } = useTranslation()

	return (
		<div>
			<Switch
				checked={isSearchCaseSensitive}
				onChange={(checked) => (app.isSearchCaseSensitive = checked)}
				label="Phân biệt hoa/thường"
			/>

			<div className="mt-1 text-zinc-400">Chế độ tìm kiếm</div>
			<Select
				fill
				value={searchModeName}
				onChange={(value) => (app.searchModeName = value)}
				items={searchModes.map((searchMode) => ({
					label: t(`searchModes.${searchMode.name}.label`),
					value: searchMode.name,
					description: t(`searchModes.${searchMode.name}.description`)
				}))}
			/>
		</div>
	)
}
