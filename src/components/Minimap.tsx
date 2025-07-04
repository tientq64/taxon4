import { memo, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { Ranks } from '../../web-extension/constants/Ranks'
import { getTaxonIconUrl } from '../helpers/getTaxonIconUrl'
import { Taxon } from '../helpers/parse'
import { useWindowSize } from '../hooks/useWindowSize'
import { useApp } from '../store/useAppStore'

const canvasWidth: number = 160
const imageSize: number = 16

function MinimapMemo(): ReactNode {
	const { filteredTaxa } = useApp()

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const contextRef = useRef<CanvasRenderingContext2D | null>(null)
	const [, canvasHeight] = useWindowSize(1000)

	const taxaHasIcon = useMemo<Taxon[]>(() => {
		return filteredTaxa.filter((taxon) => taxon.icon !== undefined) as Taxon[]
	}, [filteredTaxa])

	const handleImageLoad = useCallback(
		(image: HTMLImageElement, taxon: Taxon): void => {
			const context = contextRef.current
			if (context === null) return
			const index: number = filteredTaxa.indexOf(taxon)
			const x: number = Math.round(
				(taxon.rank.level / Ranks.length) * (canvasWidth - imageSize)
			)
			const y: number = Math.round(
				18 + (index / filteredTaxa.length) * (canvasHeight - 36 - imageSize)
			)
			context.fillStyle = '#fff'
			context.drawImage(image, x, y, imageSize, imageSize)
		},
		[filteredTaxa, canvasHeight]
	)

	useEffect(() => {
		const canvas: HTMLCanvasElement | null = canvasRef.current
		if (canvas === null) return
		canvas.width = canvasWidth
		canvas.height = canvasHeight
		contextRef.current = canvas.getContext('2d')
	}, [canvasHeight])

	useEffect(() => {
		const context = contextRef.current
		if (context === null) return
		context.clearRect(0, 0, canvasWidth, canvasHeight)
		for (const taxon of taxaHasIcon) {
			const image: HTMLImageElement = new Image()
			image.src = getTaxonIconUrl(taxon.icon!)
			image.onload = handleImageLoad.bind(null, image, taxon)
		}
	}, [taxaHasIcon, canvasHeight, handleImageLoad])

	return (
		<div className="absolute top-0 right-4 -mr-px h-full border-l border-zinc-700 bg-zinc-900">
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

export const Minimap = memo(MinimapMemo)
