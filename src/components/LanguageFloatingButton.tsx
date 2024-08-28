import { ReactNode, useContext, useMemo } from 'react'
import { AppContext } from '../App'
import { Language, popupLanguages } from '../models/popupLanguages'
import { Tooltip } from './Tooltip'
import { find } from 'lodash-es'

export function LanguageFloatingButton(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { popupLanguageCode, setPopupLanguageCode } = store

	const popupLanguage = useMemo<Language>(() => {
		return find(popupLanguages, { code: popupLanguageCode })!
	}, [popupLanguageCode])
	if (popupLanguage === undefined) return

	const switchLanguage = (): void => {
		setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
	}

	return (
		<Tooltip
			placement="top"
			content={`Nhấn để đổi sang tiếng ${popupLanguageCode === 'en' ? 'Việt' : 'Anh'}`}
		>
			<button
				className={`
				flex justify-center items-center absolute right-7 bottom-3 size-7 rounded
				${popupLanguage.colorClass}
			`}
				onClick={switchLanguage}
			>
				{popupLanguageCode}
			</button>
		</Tooltip>
	)
}
