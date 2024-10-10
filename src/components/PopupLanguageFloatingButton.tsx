import clsx from 'clsx'
import { find } from 'lodash-es'
import { ReactNode, useCallback, useMemo } from 'react'
import { Language, popupLanguages } from '../models/popupLanguages'
import { useStore } from '../store/useStore'
import { Tooltip } from './Tooltip'

export function PopupLanguageFloatingButton(): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useStore((state) => state.setPopupLanguageCode)

	const popupLanguage = useMemo<Language>(() => {
		return find(popupLanguages, { code: popupLanguageCode })!
	}, [popupLanguageCode])
	if (popupLanguage === undefined) return

	const switchPopupLanguage = useCallback((): void => {
		setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
	}, [popupLanguageCode])

	return (
		<Tooltip
			placement="top"
			content={`Nhấn để đổi sang tiếng ${popupLanguageCode === 'en' ? 'Việt' : 'Anh'}`}
		>
			<button
				className={clsx(
					'flex justify-center items-center absolute right-48 bottom-3 size-7 rounded z-30',
					popupLanguage.colorClass
				)}
				type="button"
				onClick={switchPopupLanguage}
			>
				{popupLanguageCode}
			</button>
		</Tooltip>
	)
}
