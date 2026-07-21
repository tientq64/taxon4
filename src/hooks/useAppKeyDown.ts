import { useEventListener } from 'ahooks'
import { En, Vi } from '../constants/languages'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { app, useApp } from '../store/app'

export function useAppKeyDown(): void {
	const { languageCode, developerModeEnabled } = useApp()

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (shouldIgnoreKeyDown(event)) return

		const code = event.code
		switch (code) {
			case 'KeyD':
				app.languageCode = languageCode === En ? Vi : En
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
