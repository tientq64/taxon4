import { useEventListener } from 'ahooks'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { app, useApp } from '../store/useAppStore'

export function useAppKeyDown(): void {
	const { popupLanguageCode, isDev } = useApp()

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (shouldIgnoreKeyDown(event)) return

		const code: string = event.code
		switch (code) {
			case 'KeyV':
			case 'KeyD':
				app.popupLanguageCode = popupLanguageCode === 'en' ? 'vi' : 'en'
				break

			case 'KeyF':
			case 'F3':
				event.preventDefault()
				app.isSearchPopupVisible = true
				app.keyCode = code
				break

			case 'KeyA':
				app.isDev = !isDev
				break

			case 'Escape':
				app.isSearchPopupVisible = false
				break

			case 'AltLeft':
				event.preventDefault()
				app.keyCode = code
				break

			default:
				app.keyCode = code
				break
		}
	})
}
