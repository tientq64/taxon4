import { nanoid } from 'nanoid'
import { useMemo } from 'react'

export function useNanoId(): string {
	return useMemo<string>(nanoid, [])
}
