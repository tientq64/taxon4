import { Dispatch, ReactNode, SetStateAction } from 'react'
import { useFontFaceUpdate } from './hooks/useFontFaceUpdate'
import { MainPage } from './pages/MainPage'
import { ViewBoxPhotoEditPage } from './pages/ViewBoxPhotoEditPage'

export type SetState<T> = Dispatch<SetStateAction<T>>

export function App(): ReactNode {
	const { pathname } = location

	useFontFaceUpdate()

	return (
		<div className="h-full">
			{pathname === '/view-box-photo-edit' ? <ViewBoxPhotoEditPage /> : <MainPage />}
		</div>
	)
}
