import { ChangeEvent, memo, ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { popupLanguages } from '../models/popupLanguages'
import { Select } from './Select'
import { Descriptions } from './Descriptions'
import { Ranks } from '../../web-extension/models/Ranks'

export const SettingsPanel = memo(function (): ReactNode {
	const { popupLanguageCode, setPopupLanguageCode, maxRankLevelShown, setMaxRankLevelShown } =
		useContext(AppContext)!

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
		</Descriptions>
	)
})
