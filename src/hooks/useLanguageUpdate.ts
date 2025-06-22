import { changeLanguage } from 'i18next'
import { useEffect } from 'react'
import { useApp } from '../store/useAppStore'

export function useLanguageUpdate(): void {
	const { languageCode } = useApp()

	useEffect(() => {
		changeLanguage(languageCode)
	}, [languageCode])
}
