import { filter } from 'lodash-es'
import { memo, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { Ranks } from '../../web-extension/models/Ranks'
import { getTaxonIconUrl } from '../helpers/getTaxonIconUrl'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'

export const Minimap = memo(function (): ReactNode {
	const filteredTaxa = useStore((state) => state.filteredTaxa)

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const canvasWidth: number = 160
	const canvasHeight: number = innerHeight
	const imageSize: number = 16

	const taxaHasIcon = useMemo<Taxon[]>(() => {
		return filter(filteredTaxa, 'icon')
	}, [filteredTaxa])

	const context = useMemo<CanvasRenderingContext2D | null>(() => {
		const canvas: HTMLCanvasElement | null = canvasRef.current
		if (canvas === null) return null
		canvas.width = canvasWidth
		canvas.height = canvasHeight
		return canvas.getContext('2d')
	}, [canvasRef.current])

	const handleImageLoad = useCallback(
		(image: HTMLImageElement, taxon: Taxon): void => {
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
		[context]
	)

	useEffect(() => {
		if (context === null) return
		context.clearRect(0, 0, canvasWidth, canvasHeight)
		for (const taxon of taxaHasIcon) {
			const image: HTMLImageElement = new Image()
			image.src = getTaxonIconUrl(taxon.icon!)
			image.onload = handleImageLoad.bind(null, image, taxon)
		}
	}, [context, taxaHasIcon])

	return (
		<div className="absolute right-4 top-0 h-full">
			<canvas ref={canvasRef}></canvas>
		</div>
	)
})
