import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { searchModes } from '../constants/searchModes'
import { searchTargets } from '../constants/searchTargets'
import { app, useApp } from '../store/app'
import { Select, SelectItem, SelectItemType } from './Select'
import { Switch } from './Switch'

export function SearchFilters(): ReactNode {
	const { isSearchCaseSensitive, searchModeName, searchTargetName } = useApp()
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
				items={searchModes.map((mode) => ({
					label: t(`searchModes.${mode.name}.label`),
					value: mode.name,
					description: t(`searchModes.${mode.name}.description`)
				}))}
			/>

			<div className="mt-1 text-zinc-400">Đối tượng tìm kiếm</div>
			<Select
				fill
				value={searchTargetName}
				onChange={(value) => (app.searchTargetName = value)}
				items={searchTargets
					.map<SelectItem>((target) => ({
						label: t(`searchTargets.${target.name}.label`),
						value: target.name,
						description: t(`searchTargets.${target.name}.description`)
					}))
					.toSpliced(1, 0, {
						type: SelectItemType.Divider
					})}
			/>
		</div>
	)
}
