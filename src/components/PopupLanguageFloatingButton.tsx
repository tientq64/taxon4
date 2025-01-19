import clsx from 'clsx'
import { find } from 'lodash-es'
import { ReactNode, useCallback, useMemo } from 'react'
import { Language, popupLanguages } from '../models/popupLanguages'
import { useAppStore } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

export function PopupLanguageFloatingButton(): ReactNode {
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useAppStore((state) => state.setPopupLanguageCode)

	const popupLanguage = useMemo<Language | undefined>(() => {
		return find(popupLanguages, { code: popupLanguageCode })
	}, [popupLanguageCode])

	const switchPopupLanguage = useCallback((): void => {
		setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
	}, [popupLanguageCode, setPopupLanguageCode])

	return (
		popupLanguage && (
			<Tooltip
				placement="top"
				content={`Nhấn để đổi sang tiếng ${popupLanguageCode === 'en' ? 'Việt' : 'Anh'}`}
			>
				<button
					className={clsx(
						'absolute bottom-3 right-48 z-30 flex size-7 items-center justify-center rounded',
						popupLanguage.colorClass
					)}
					type="button"
					onClick={switchPopupLanguage}
				>
					{popupLanguageCode}
				</button>
			</Tooltip>
		)
	)
}
