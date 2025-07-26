import { useResponsive } from 'ahooks'
import { useEffect } from 'react'
import { app } from '../store/useAppStore'

/** Cập nhật độ rộng thụt lề khi kích thước cửa sổ thay đổi. */
export function useRankLevelWidthUpdate(): void {
	const responsive = useResponsive()

	useEffect(() => {
		if (responsive.xxl) {
			app.rankLevelWidth = 16
		} else if (responsive.xl) {
			app.rankLevelWidth = 8
		} else if (responsive.lg) {
			app.rankLevelWidth = 4
		} else {
			app.rankLevelWidth = 0
		}
	}, [responsive])
}
