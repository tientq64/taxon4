import { useEffect, useState } from 'react'

export function useUrlChange(): string {
	const [changedUrl, setChangedUrl] = useState<string>(location.href)

	const handleUrlChange = (event: UrlChangeEvent): void => {
		setChangedUrl(event.url)
	}

	useEffect(() => {
		window.addEventListener('urlchange', handleUrlChange)
		return () => {
			window.removeEventListener('urlchange', handleUrlChange)
		}
	}, [])

	return changedUrl
}
