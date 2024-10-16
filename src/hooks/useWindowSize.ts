import { useThrottle } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'

export function useWindowSize(throttleWait: number = 0): [number, number] {
	const [size, setSize] = useState<[number, number]>([innerWidth, innerHeight])
	const waitedSize = useThrottle(size, { wait: throttleWait })

	const handleWindowResize = useCallback(() => {
		setSize([innerWidth, innerHeight])
	}, [])

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize)
		return () => {
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [])

	return waitedSize
}
