import { useEffect, useState } from 'react'

/**
 * Trả về URL mới mỗi khi URL trang thay đổi. Sử dụng sự kiện `urlchange` của userscript.
 */
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
