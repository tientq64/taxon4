import { ReactNode, useEffect, useRef } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import { useApp } from '../store/app'

export function SearchResultMarkers(): ReactNode {
	const { filteredTaxa, searchResult } = useApp()

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

	const canwidthWidth: number = 8
	const canvasHeight: number = useWindowSize()[1] - 36

	useEffect(() => {
		const canvas = canvasRef.current
		if (canvas === null) return
		canvas.width = canwidthWidth
		canvas.height = canvasHeight
		ctxRef.current = canvas.getContext('2d')
	}, [canvasHeight])

	useEffect(() => {
		const ctx = ctxRef.current
		if (ctx === null) return
		ctx.clearRect(0, 0, canwidthWidth, canvasHeight)
		ctx.fillStyle = '#fcd34d'
		for (const taxon of searchResult) {
			const y: number = Math.round((taxon.filteredIndex / filteredTaxa.length) * canvasHeight)
			ctx.fillRect(0, y - 1, canwidthWidth, 2)
		}
	}, [canvasHeight, searchResult])

	return (
		<canvas ref={canvasRef} className="pointer-events-none mt-[18px] h-[calc(100%-36px)] w-2" />
	)
}
