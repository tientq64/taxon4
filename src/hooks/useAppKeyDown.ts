import { useEventListener } from 'ahooks'
import { LanguageCode } from '../constants/languages'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { app, useApp } from '../store/useAppStore'

export function useAppKeyDown(): void {
	const { popupLanguageCode, developerModeEnabled } = useApp()

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (shouldIgnoreKeyDown(event)) return

		const code: string = event.code
		switch (code) {
			case 'KeyV':
			case 'KeyD':
				app.popupLanguageCode =
					popupLanguageCode === LanguageCode.En ? LanguageCode.Vi : LanguageCode.En
				break

			case 'KeyF':
			case 'F3':
				event.preventDefault()
				app.isSearchPopupVisible = true
				app.keyCode = code
				break

			case 'KeyA':
				app.developerModeEnabled = !developerModeEnabled
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
