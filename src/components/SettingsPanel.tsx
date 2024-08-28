import { ChangeEvent, ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { popupLanguages } from '../models/popupLanguages'
import { Select } from './Select'

export function SettingsPanel(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { popupLanguageCode, setPopupLanguageCode } = store

	const handlePopupLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setPopupLanguageCode(event.target.value)
	}

	return (
		<div className="flex flex-col gap-2">
			<div>
				<div className="text-zinc-400">Ngôn ngữ popup:</div>
				<Select
					fill
					value={popupLanguageCode}
					onChange={handlePopupLanguageChange}
					options={popupLanguages.map((language) => ({
						label: language.text,
						value: language.code
					}))}
				/>
			</div>
		</div>
	)
}
