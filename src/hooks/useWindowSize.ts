import { useCallback, useEffect, useState } from 'react'

export function useWindowSize(): [number, number] {
	const [size, setSize] = useState<[number, number]>([innerWidth, innerHeight])

	const handleWindowResize = useCallback((): void => {
		setSize([innerWidth, innerHeight])
	}, [])

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize)
		return () => {
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [])

	return size
}
