import { ChangeEvent, ReactNode } from 'react'
import { Ranks } from '../../web-extension/models/Ranks'
import { popupLanguages } from '../models/popupLanguages'
import { useStore } from '../store/useStore'
import { Descriptions } from './Descriptions'
import { Select } from './Select'
import { Switch } from './Switch'

export function SettingsPanel(): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useStore((state) => state.setPopupLanguageCode)
	const maxRankLevelShown = useStore((state) => state.maxRankLevelShown)
	const setMaxRankLevelShown = useStore((state) => state.setMaxRankLevelShown)
	const isDev = useStore((state) => state.isDev)
	const setIsDev = useStore((state) => state.setIsDev)

	const handlePopupLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setPopupLanguageCode(event.target.value)
	}

	const handleMaxRankLevelShownChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setMaxRankLevelShown(Number(event.target.value))
	}

	return (
		<Descriptions>
			<div>Ngôn ngữ popup:</div>
			<Select
				fill
				value={popupLanguageCode}
				onChange={handlePopupLanguageChange}
				options={popupLanguages.map((language) => ({
					label: language.text,
					value: language.code
				}))}
			/>

			<div>Bậc tối đa được hiển thị:</div>
			<Select
				fill
				value={maxRankLevelShown}
				onChange={handleMaxRankLevelShownChange}
				options={Ranks.map((rank) => ({
					label: `${rank.textEn} - ${rank.textVi}`,
					value: rank.level
				}))}
			/>

			<div className="!mt-4"></div>
			<Switch checked={isDev} onChange={setIsDev} label="Chế độ nhà phát triển" />
		</Descriptions>
	)
}
