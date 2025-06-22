import { FossilRange } from '../api/getFossilRange'

export function isFossilRange(data: unknown): data is FossilRange {
	return data != null && Object.hasOwn(data, 'isFossilRange')
}
