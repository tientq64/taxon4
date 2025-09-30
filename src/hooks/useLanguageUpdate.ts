import { changeLanguage } from 'i18next'
import { useEffect } from 'react'
import { app, useApp } from '../store/app'

export function useLanguageUpdate(): void {
	const { languageCode } = useApp()

	useEffect(() => {
		changeLanguage(languageCode)
		app.languageCode = languageCode
	}, [languageCode])
}
