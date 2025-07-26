import { changeLanguage } from 'i18next'
import { useEffect } from 'react'
import { app, useApp } from '../store/useAppStore'

export function useLanguageUpdate(): void {
	const { languageCode } = useApp()

	useEffect(() => {
		changeLanguage(languageCode)
		app.popupLanguageCode = languageCode
	}, [languageCode])
}
