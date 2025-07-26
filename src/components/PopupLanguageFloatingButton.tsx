import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { Language, LanguageCode, languages } from '../constants/languages'
import { app, useApp } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

export function PopupLanguageFloatingButton(): ReactNode {
	const { popupLanguageCode, minimapVisible } = useApp()

	const popupLanguage = useMemo<Language | undefined>(() => {
		return languages.find((language) => language.code === popupLanguageCode)
	}, [popupLanguageCode])

	const handleSwitchLanguage = (): void => {
		app.popupLanguageCode =
			popupLanguageCode === LanguageCode.En ? LanguageCode.Vi : LanguageCode.En
	}

	return (
		popupLanguage && (
			<Tooltip
				placement="top"
				content={`Nhấn để đổi sang tiếng ${popupLanguageCode === LanguageCode.En ? 'Việt' : 'Anh'}`}
			>
				<button
					className={clsx(
						'absolute bottom-3 z-30 flex size-7 cursor-pointer items-center justify-center rounded',
						minimapVisible ? 'right-48 -mr-1' : 'right-7',
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
