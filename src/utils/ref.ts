import { ref as valtioRef } from 'valtio'

export function ref<T>(value: T): T {
	if (value && typeof value === 'object') {
		return valtioRef(value)
	}
	return value
}
