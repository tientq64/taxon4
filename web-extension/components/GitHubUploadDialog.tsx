import { useDebounceFn } from 'ahooks'
import clsx from 'clsx'
import { range, round } from 'lodash-es'
import PicaClass, { Pica } from 'pica'
import {
	PointerEvent,
	ReactNode,
	SyntheticEvent,
	useEffect,
	useMemo,
	useRef,
	WheelEvent
} from 'react'
import { proxy, useSnapshot } from 'valtio'
import { showToast, Toast } from '../helpers/showToast'
import { uploadToGitHub } from '../helpers/uploadToGitHub'
import { ext, useExt } from '../store/ext'
import { copyText } from '../utils/clipboard'
import { css } from '../utils/css'
import { textToBase64 } from '../utils/textToBase64'
import { Button } from './Button'

interface State {
	imageLoaded: boolean
	scale: number
	translateX: number
	translateY: number
	widths: number[]
	heights: number[]
	width: number
	height: number
	left: number
	top: number
	gridShown: boolean
	downscaling: boolean
	uploading: boolean
	unsharpAmounts: number[]
	unsharpRadiuses: number[]
	unsharpThresholds: number[]
	unsharpAmount: number
	unsharpRadius: number
	unsharpThreshold: number
}

const defaultState: State = {
	imageLoaded: false,
	scale: 1,
	translateX: 0,
	translateY: 0,
	widths: [320, 300, 280, 260, 240, 220, 200, 180],
	heights: [256, 240, 230, 220, 210, 200, 190, 180, 160, 140],
	width: 320,
	height: 256,
	left: 0,
	top: 0,
	gridShown: false,
	downscaling: false,
	uploading: false,
	unsharpAmounts: [...range(0, 200, 25), 200],
	unsharpRadiuses: [0.5, ...range(0.6, 2, 0.2), 2].map((val) => round(val, 1)),
	unsharpThresholds: [0, 2, 25, ...range(50, 255, 50), 255],
	unsharpAmount: 0,
	unsharpRadius: 0.6,
	unsharpThreshold: 2
}
const state = proxy<State>(structuredClone(defaultState))

export function GitHubUploadDialog(): ReactNode {
	const { gitHubUploadImageUrl } = useExt()

	const {
		imageLoaded,
		scale,
		translateX,
		translateY,
		widths,
		heights,
		width,
		height,
		left,
		top,
		gridShown,
		downscaling,
		uploading,
		unsharpAmounts,
		unsharpRadiuses,
		unsharpThresholds,
		unsharpAmount,
		unsharpRadius,
		unsharpThreshold
	} = useSnapshot(state)

	const frame = useRef<HTMLDivElement | null>(null)
	const image = useRef<HTMLImageElement | null>(null)
	const canvas = useRef<HTMLCanvasElement | null>(null)

	const corsImageUrl = useMemo<string | undefined>(() => {
		if (gitHubUploadImageUrl === undefined) return
		const encodedImageUrl: string = textToBase64(gitHubUploadImageUrl)
		return `http://localhost:5500/download/${encodedImageUrl}`
	}, [gitHubUploadImageUrl])

	const downscale = useDebounceFn(
		async (): Promise<void> => {
			if (image.current === null || canvas.current === null) return
			const ctx: CanvasRenderingContext2D | null = canvas.current.getContext('2d')
			if (ctx === null) return
			state.downscaling = true
			const imageRect: DOMRect = image.current.getBoundingClientRect()
			ctx.drawImage(image.current, left, top, imageRect.width, imageRect.height)
			const pica: Pica = new PicaClass()
			await pica.resize(canvas.current, canvas.current, {
				unsharpAmount,
				unsharpRadius,
				unsharpThreshold
			})
			state.downscaling = false
		},
		{ wait: 500 }
	)

	const handleEditorWheel = (event: WheelEvent<HTMLDivElement>): void => {
		state.scale -= event.deltaY < 0 ? -0.05 : 0.05
	}

	const handleFramePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
		event.currentTarget.setPointerCapture(event.pointerId)
		if (event.buttons === 1) {
			state.translateX += event.movementX
			state.translateY += event.movementY
			state.gridShown = true
		}
	}

	const handleFrameLostPointerCapture = (): void => {
		state.gridShown = false
	}

	const handleCorsImageLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
		const { width, height } = event.currentTarget
		state.height = height
		if (!widths.includes(width)) {
			state.widths.unshift(width)
		}
		if (!heights.includes(height)) {
			state.heights.unshift(height)
		}
		state.imageLoaded = true
		event.currentTarget.remove()
		downscale.run()
	}

	const handleUploadButtonClick = async (): Promise<void> => {
		if (gitHubUploadImageUrl === undefined) return
		if (canvas.current === null) return
		state.uploading = true
		const toast: Toast = showToast('Đang tải ảnh lên GitHub', Infinity)
		try {
			const dataUrl: string = canvas.current.toDataURL('image/webp', 0.9)
			const gitHubImageId: string = await uploadToGitHub(dataUrl, gitHubUploadImageUrl)
			copyText(` | =${gitHubImageId}`)
			toast.update(`Đã tải ảnh lên GitHub với id: ${gitHubImageId}`)
			ext.gitHubUploadImageUrl = undefined
		} catch (error) {
			toast.update(`Đã xảy ra lỗi khi tải lên GitHub: ${String(error)}`)
			console.error(error)
		}
		state.uploading = false
	}

	useEffect(() => {
		if (width === 320) return
		state.height = 256
	}, [width])

	useEffect(() => {
		if (height === 256) return
		state.width = 320
	}, [height])

	useEffect(() => {
		if (frame.current === null || image.current === null) return
		if (!imageLoaded) return
		const frameRect: DOMRect = frame.current.getBoundingClientRect()
		const imageRect: DOMRect = image.current.getBoundingClientRect()
		state.left = imageRect.left - frameRect.left
		state.top = imageRect.top - frameRect.top
		const right: number = imageRect.right - frameRect.right
		const bottom: number = imageRect.bottom - frameRect.bottom
		const offsetWidth: number = imageRect.width - frameRect.width
		const offsetHeight: number = imageRect.height - frameRect.height
		if (scale < 1) {
			state.scale = 1
			return
		}
		if (offsetWidth >= 0) {
			if (state.left > 0) {
				state.translateX--
			} else if (right < 0) {
				state.translateX++
			}
		} else {
			state.translateX = 0
		}
		if (offsetHeight >= 0) {
			if (state.top > 0) {
				state.translateY--
			} else if (bottom < 0) {
				state.translateY++
			}
		} else {
			state.scale += 0.01
			state.translateY = 0
		}
		state.downscaling = true
		downscale.run()
	}, [
		imageLoaded,
		scale,
		translateX,
		translateY,
		width,
		height,
		unsharpAmount,
		unsharpRadius,
		unsharpThreshold
	])

	useEffect(() => {
		return () => {
			downscale.cancel()
			Object.assign(state, structuredClone(defaultState))
		}
	}, [gitHubUploadImageUrl])

	return (
		<div className="pointer-events-auto fixed top-32 left-1/2 -translate-x-[calc(50%-0.5px)] rounded-xl border border-zinc-500 bg-zinc-900 p-4 shadow-xl shadow-black">
			<div className="flex flex-col gap-4 bg-zinc-900">
				{corsImageUrl === undefined && (
					<div className="text-rose-500">Không có URL ảnh cần chỉnh sửa!</div>
				)}

				{corsImageUrl !== undefined && (
					<>
						<div className="flex gap-4">
							<div className="flex flex-col gap-2">
								<div
									ref={frame}
									className="relative flex items-center justify-center overflow-hidden rounded-md"
									style={{ height }}
									onWheel={handleEditorWheel}
									onPointerMove={handleFramePointerMove}
									onLostPointerCapture={handleFrameLostPointerCapture}
								>
									<img
										ref={image}
										className={clsx(
											'rendering-contrast drag-none max-w-[unset]!'
										)}
										style={{
											width,
											transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`
										}}
										src={corsImageUrl}
										crossOrigin="anonymous"
									/>

									{gridShown && (
										<div className="absolute inset-0">
											<div className="absolute left-1/3 h-full w-px bg-white/25" />
											<div className="absolute left-2/3 h-full w-px bg-white/25" />
											<div className="absolute top-1/3 h-px w-full bg-white/25" />
											<div className="absolute top-2/3 h-px w-full bg-white/25" />
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<div className="flex flex-1 gap-2">
									<div className="h-full overflow-auto">
										{widths.map((width2) => (
											<button
												className={clsx(
													'flex w-12 rounded border-0 px-2 py-0 hover:bg-zinc-700',
													width === width2 && 'bg-blue-300! text-black',
													(!imageLoaded || uploading) &&
														'pointer-events-none opacity-50'
												)}
												onClick={() => (state.width = width2)}
											>
												{width2}
											</button>
										))}
									</div>

									<div className="h-full overflow-auto">
										{heights.map((height2) => (
											<button
												className={clsx(
													'flex w-12 rounded border-0 px-2 py-0 hover:bg-zinc-700',
													height === height2 && 'bg-blue-300! text-black',
													(!imageLoaded || uploading) &&
														'pointer-events-none opacity-50'
												)}
												onClick={() => (state.height = height2)}
											>
												{height2}
											</button>
										))}
									</div>

									<div className="w-px bg-zinc-600" />

									<div className="h-full overflow-auto">
										{unsharpAmounts.map((amount) => (
											<button
												className={clsx(
													'flex w-12 rounded border-0 px-2 py-0 hover:bg-zinc-700',
													unsharpAmount === amount &&
														'bg-pink-300! text-black',
													(!imageLoaded || uploading) &&
														'pointer-events-none opacity-50'
												)}
												onClick={() => (state.unsharpAmount = amount)}
											>
												{amount}
											</button>
										))}
									</div>

									<div className="h-full overflow-auto">
										{unsharpRadiuses.map((radius) => (
											<button
												className={clsx(
													'flex w-12 rounded border-0 px-2 py-0 hover:bg-zinc-700',
													unsharpRadius === radius &&
														'bg-pink-300! text-black',
													(!imageLoaded || uploading) &&
														'pointer-events-none opacity-50'
												)}
												onClick={() => (state.unsharpRadius = radius)}
											>
												{radius}
											</button>
										))}
									</div>

									<div className="h-full overflow-auto">
										{unsharpThresholds.map((threshold) => (
											<button
												className={clsx(
													'flex w-12 rounded border-0 px-2 py-0 hover:bg-zinc-700',
													unsharpThreshold === threshold &&
														'bg-pink-300! text-black',
													(!imageLoaded || uploading) &&
														'pointer-events-none opacity-50'
												)}
												onClick={() => (state.unsharpThreshold = threshold)}
											>
												{threshold}
											</button>
										))}
									</div>
								</div>
							</div>

							<div>
								<canvas
									ref={canvas}
									className={clsx('rounded-md', downscaling && 'opacity-50')}
									width={width}
									height={height}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								disabled={uploading}
								onClick={() => {
									ext.gitHubUploadImageUrl = undefined
								}}
							>
								Đóng
							</Button>

							<Button
								disabled={canvas.current === null || downscaling || uploading}
								onClick={handleUploadButtonClick}
							>
								Tải lên GitHub
							</Button>
						</div>
					</>
				)}
			</div>

			<img
				className="pointer-events-none invisible absolute max-h-[256px]! max-w-[320px]!"
				src={corsImageUrl}
				onLoad={handleCorsImageLoad}
			/>

			<style>{cssText}</style>
		</div>
	)
}

const cssText: string = css`
	html {
		overflow: hidden;
	}
`
