import { ReactNode, useEffect, useRef } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import { useApp } from '../store/app'

const canvasWidth = 8
const markersColor = '#fcd34d'
const markersHeight = 2

export function SearchResultMarkers(): ReactNode {
	const { filteredTaxa, searchResult } = useApp()

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

	const canvasHeight = useWindowSize()[1] - 36

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		canvas.width = canvasWidth
		canvas.height = canvasHeight
		ctxRef.current = canvas.getContext('2d')
	}, [canvasHeight])

	useEffect(() => {
		const ctx = ctxRef.current
		if (!ctx) return

		ctx.clearRect(0, 0, canvasWidth, canvasHeight)
		ctx.fillStyle = markersColor
		for (const taxon of searchResult) {
			const y = Math.round((taxon.filteredIndex / filteredTaxa.length) * canvasHeight)
			const offsetY = Math.floor(markersHeight / 2)
			ctx.fillRect(0, y - offsetY, canvasWidth, markersHeight)
		}
	}, [canvasHeight, searchResult])

	return (
		<canvas ref={canvasRef} className="pointer-events-none mt-[18px] h-[calc(100%-36px)] w-2" />
	)
}
