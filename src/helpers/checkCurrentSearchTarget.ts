import { SearchTargetName } from '../constants/searchTargets'
import { app } from '../store/app'

export function checkCurrentSearchTarget(name: SearchTargetName): boolean {
	const { searchTargetName } = app

	return searchTargetName === SearchTargetName.All || searchTargetName === name
}
