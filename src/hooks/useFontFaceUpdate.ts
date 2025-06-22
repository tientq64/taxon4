import { useEffect, useMemo } from 'react'
import { FontFace2, getFontFace } from '../constants/fontFaces'
import { useApp } from '../store/useAppStore'
import { useLoadCss } from './useLoadCss'

export function useFontFaceUpdate(): void {
	const { fontFaceFamily } = useApp()

	const fontFace = useMemo<FontFace2 | undefined>(() => {
		return getFontFace(fontFaceFamily)
	}, [fontFaceFamily])

	useLoadCss(
		fontFace &&
			`https://fonts.googleapis.com/css2?family=${fontFace.family}:wght@400;700&display=swap`
	)

	useEffect(() => {
		if (fontFace === undefined) return
		document.body.style.fontFamily = `${fontFace.family}, ${fontFace.fallbackFamilies}`
		document.body.style.fontSize = `${fontFace.size}px`
	}, [fontFace])
}
