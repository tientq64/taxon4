import { RecentExtinction } from '../api/getFossilRange'

export function isRecentExtinction(data: unknown): data is RecentExtinction {
	return data != null && Object.hasOwn(data, 'isRecentExtinction')
}
