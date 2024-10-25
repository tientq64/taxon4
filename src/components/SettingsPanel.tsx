import { ChangeEvent, ReactNode } from 'react'
import { Ranks } from '../../web-extension/models/Ranks'
import { popupLanguages } from '../models/popupLanguages'
import { useStore } from '../store/useStore'
import { Descriptions } from './Descriptions'
import { Select } from './Select'
import { Switch } from './Switch'

/**
 * Mục cài đặt.
 */
export function SettingsPanel(): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useStore((state) => state.setPopupLanguageCode)
	const maxRankLevelShown = useStore((state) => state.maxRankLevelShown)
	const setMaxRankLevelShown = useStore((state) => state.setMaxRankLevelShown)
	const striped = useStore((state) => state.striped)
	const setStriped = useStore((state) => state.setStriped)
	const indentGuideShown = useStore((state) => state.indentGuideShown)
	const setIndentGuideShown = useStore((state) => state.setIndentGuideShown)
	const minimapShown = useStore((state) => state.minimapShown)
	const setMinimapShown = useStore((state) => state.setMinimapShown)
	const isDev = useStore((state) => state.isDev)
	const setIsDev = useStore((state) => state.setIsDev)

	const handlePopupLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setPopupLanguageCode(event.target.value)
	}

	const handleMaxRankLevelShownChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setMaxRankLevelShown(Number(event.target.value))
	}

	return (
		<Descriptions className="px-3">
			<div>Ngôn ngữ popup:</div>
			<Select
				fill
				value={popupLanguageCode}
				onChange={handlePopupLanguageChange}
				options={popupLanguages.map((language) => ({
					label: `\u200c${language.text}`,
					value: language.code
				}))}
			/>

			<div>Bậc tối đa được hiển thị:</div>
			<Select
				fill
				value={maxRankLevelShown}
				onChange={handleMaxRankLevelShownChange}
				options={Ranks.map((rank) => ({
					label: `\u200c${rank.textEn} \u2013 ${rank.textVi}`,
					value: rank.level
				}))}
			/>

			<div className="!mt-4">
				<Switch checked={striped} onChange={setStriped} label="Danh sách kẻ sọc" />
				<Switch
					checked={indentGuideShown}
					onChange={setIndentGuideShown}
					label="Đường kẻ thụt lề"
				/>
				<Switch checked={minimapShown} onChange={setMinimapShown} label="Bản đồ thu nhỏ" />
				<Switch checked={isDev} onChange={setIsDev} label="Chế độ nhà phát triển" />
			</div>
		</Descriptions>
	)
}
