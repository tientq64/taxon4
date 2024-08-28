import { useEffect, useState } from 'react'
import { SetState } from '../App'

export function useLocalStorageState<T = any>(key: string, defaultValue: T): [T, SetState<T>] {
	const keyWithNamespace: string = `tientq64/taxon4:${key}`
	const jsonValue: string | null = localStorage.getItem(keyWithNamespace)

	let initialValue: T
	if (jsonValue === null) {
		initialValue = defaultValue
	} else {
		try {
			initialValue = JSON.parse(jsonValue)
		} catch {
			initialValue = defaultValue
		}
	}

	const [value, setValue] = useState<T>(initialValue)

	useEffect(() => {
		const newJsonValue: string = JSON.stringify(value)
		localStorage.setItem(keyWithNamespace, newJsonValue)
	}, [value])

	return [value, setValue]
}
