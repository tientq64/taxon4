import { useExternal } from 'ahooks'
import { Dispatch, ReactNode, SetStateAction, useEffect } from 'react'
import { FontFace2, getFontFace } from './constants/fontFaces'
import { MainPage } from './pages/MainPage'
import { ViewBoxPhotoEditPage } from './pages/ViewBoxPhotoEditPage'
import { useAppStore } from './store/useAppStore'

export type SetState<T> = Dispatch<SetStateAction<T>>

export function App(): ReactNode {
	const fontFaceFamily = useAppStore((state) => state.fontFaceFamily)

	const { pathname } = location

	useExternal(
		`https://fonts.googleapis.com/css2?family=${fontFaceFamily}:wght@100..900&display=swap`,
		{ type: 'css' }
	)

	useEffect(() => {
		const fontFace: FontFace2 | undefined = getFontFace(fontFaceFamily)
		if (fontFace === undefined) return
		const cssFontFamily: string = `${fontFace.family}, ${fontFace.fallbackFamilies}`
		document.body.style.fontFamily = cssFontFamily
	}, [fontFaceFamily])

	switch (pathname) {
		case '/view-box-photo-edit':
			return <ViewBoxPhotoEditPage />
		default:
			return <MainPage />
	}
}
