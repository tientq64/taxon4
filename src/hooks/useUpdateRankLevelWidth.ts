import { useResponsive } from 'ahooks'
import { useEffect, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useUpdateRankLevelWidth(): void {
	const setRankLevelWidth = useAppStore((state) => state.setRankLevelWidth)

	const responsive = useResponsive()

	const rankLevelWidthByResponsive = useMemo<number>(() => {
		if (responsive.xxl) return 16
		if (responsive.xl) return 8
		if (responsive.lg) return 4
		return 0
	}, [responsive])

	useEffect(() => {
		setRankLevelWidth(rankLevelWidthByResponsive)
	}, [rankLevelWidthByResponsive])
}
