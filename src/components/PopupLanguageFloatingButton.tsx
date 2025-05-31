import clsx from 'clsx'
import { find } from 'lodash-es'
import { ReactNode, useMemo } from 'react'
import { Language, popupLanguages } from '../constants/popupLanguages'
import { useAppStore } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

export function PopupLanguageFloatingButton(): ReactNode {
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const minimapShown = useAppStore((state) => state.minimapShown)
	const setPopupLanguageCode = useAppStore((state) => state.setPopupLanguageCode)

	const popupLanguage = useMemo<Language | undefined>(() => {
		return find(popupLanguages, { code: popupLanguageCode })
	}, [popupLanguageCode])

	const handleSwitchLanguage = (): void => {
		setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
	}

	return (
		popupLanguage && (
			<Tooltip
				placement="top"
				content={`Nhấn để đổi sang tiếng ${popupLanguageCode === 'en' ? 'Việt' : 'Anh'}`}
			>
				<button
					className={clsx(
						'absolute bottom-3 z-30 flex size-7 items-center justify-center rounded',
						minimapShown ? 'right-48 -mr-1' : 'right-7',
						popupLanguage.colorClass
					)}
					type="button"
					onClick={handleSwitchLanguage}
				>
					{popupLanguageCode}
				</button>
			</Tooltip>
		)
	)
}
