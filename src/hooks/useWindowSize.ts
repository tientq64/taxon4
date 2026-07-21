import { useEventListener, useThrottle } from 'ahooks'
import { useState } from 'react'

export function useWindowSize(throttleWait: number = 0): [number, number] {
	const [size, setSize] = useState<[number, number]>(() => [innerWidth, innerHeight])

	const waitedSize = useThrottle(size, { wait: throttleWait })

	useEventListener('resize', () => {
		setSize([innerWidth, innerHeight])
	})

	return waitedSize
}
