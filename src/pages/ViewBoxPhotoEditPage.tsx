import { ReactNode } from 'react'
import { ViewBoxPhotoEditor } from '../../web-extension/components/ViewBoxPhotoEditor'
import { base64ToText } from '../../web-extension/helpers/base64ToText'

export function ViewBoxPhotoEditPage(): ReactNode {
	const params = new URLSearchParams(location.search)
	const encodedPhotoUrl: string | null = params.get('encodedPhotoUrl')!
	const photoUrl: string = base64ToText(encodedPhotoUrl)

	return <ViewBoxPhotoEditor photoUrl={photoUrl} />
}
