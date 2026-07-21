import { useEffect, useMemo } from 'react'
import { getFontFace } from '../constants/fontFaces'
import { useApp } from '../store/app'
import { useLoadCss } from './useLoadCss'

export function useFontFaceUpdate(): void {
	const { fontFaceFamily } = useApp()

	const fontFace = useMemo(() => getFontFace(fontFaceFamily), [fontFaceFamily])

	useLoadCss(fontFace && getGoogleFontUrl(fontFace.family))

	useEffect(() => {
		if (!fontFace) return
		document.body.style.fontFamily = `${fontFace.family}, ${fontFace.fallbackFamilies}`
		document.body.style.fontSize = `${fontFace.size}px`
	}, [fontFace])
}

function getGoogleFontUrl(fontFamily: string): string {
	return `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;700&display=swap`
}
