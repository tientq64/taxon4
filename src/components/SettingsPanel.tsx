import { ChangeEvent, ReactNode } from 'react'
import { Ranks } from '../../web-extension/constants/Ranks'
import { fontFaces } from '../constants/fontFaces'
import { popupLanguages } from '../constants/popupLanguages'
import { makeInaccessibleSelectLabel } from '../helpers/makeInaccessibleSelectLabel'
import { useAppStore } from '../store/useAppStore'
import { Descriptions } from './Descriptions'
import { Select } from './Select'
import { Switch } from './Switch'

/**
 * Mục cài đặt.
 */
export function SettingsPanel(): ReactNode {
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useAppStore((state) => state.setPopupLanguageCode)
	const maxRankLevelShown = useAppStore((state) => state.maxRankLevelShown)
	const setMaxRankLevelShown = useAppStore((state) => state.setMaxRankLevelShown)
	const fontFaceFamily = useAppStore((state) => state.fontFaceFamily)
	const setFontFaceFamily = useAppStore((state) => state.setFontFaceFamily)
	const striped = useAppStore((state) => state.striped)
	const setStriped = useAppStore((state) => state.setStriped)
	const indentGuideShown = useAppStore((state) => state.indentGuideShown)
	const setIndentGuideShown = useAppStore((state) => state.setIndentGuideShown)
	const minimapShown = useAppStore((state) => state.minimapShown)
	const setMinimapShown = useAppStore((state) => state.setMinimapShown)
	const isDev = useAppStore((state) => state.isDev)
	const setIsDev = useAppStore((state) => state.setIsDev)

	const handlePopupLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setPopupLanguageCode(event.target.value)
	}

	const handleFontFaceFamilyChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setFontFaceFamily(event.target.value)
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
					label: makeInaccessibleSelectLabel(language.text),
					value: language.code
				}))}
			/>

			<div>Phông chữ:</div>
			<Select
				fill
				value={fontFaceFamily}
				onChange={handleFontFaceFamilyChange}
				options={fontFaces.map((fontFace) => ({
					label: makeInaccessibleSelectLabel(fontFace.family),
					value: fontFace.family,
					style: {
						fontFamily: `${fontFace.family}, ${fontFace.fallbackFamilies}`
					}
				}))}
			/>

			<div>Bậc tối đa được hiển thị:</div>
			<Select
				fill
				value={maxRankLevelShown}
				onChange={handleMaxRankLevelShownChange}
				options={Ranks.map((rank) => ({
					label: makeInaccessibleSelectLabel(`${rank.textEn} \u2013 ${rank.textVi}`),
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
