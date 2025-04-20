import { useEventListener } from 'ahooks'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { useAppStore } from '../store/useAppStore'

export function useAppKeyDown(): void {
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const isDev = useAppStore((state) => state.isDev)

	const setPopupLanguageCode = useAppStore((state) => state.setPopupLanguageCode)
	const setIsSearchPopupVisible = useAppStore((state) => state.setIsSearchPopupVisible)
	const setIsDev = useAppStore((state) => state.setIsDev)
	const setKeyCode = useAppStore((state) => state.setKeyCode)

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (shouldIgnoreKeyDown(event)) return

		const code: string = event.code
		switch (code) {
			case 'KeyV':
			case 'KeyD':
				setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
				break

			case 'KeyF':
			case 'F3':
				event.preventDefault()
				setIsSearchPopupVisible(true)
				setKeyCode(code)
				break

			case 'KeyA':
				setIsDev(!isDev)
				break

			case 'Escape':
				setIsSearchPopupVisible(false)
				break

			case 'AltLeft':
				event.preventDefault()
				setKeyCode(code)
				break

			default:
				setKeyCode(code)
				break
		}
	})
}
