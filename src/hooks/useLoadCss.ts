import { useEffect } from 'react'

export function useLoadCss(url: string | undefined): void {
	useEffect(() => {
		if (!url) return

		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = url
		document.head.appendChild(link)

		return () => link.remove()
	}, [url])
}
