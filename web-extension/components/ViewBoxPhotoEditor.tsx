import { PointerEvent, ReactNode, useEffect, useMemo, WheelEvent } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { copyText } from '../utils/clipboard'
import { wait } from '../utils/wait'

interface State {
	top: number
	right: number
	bottom: number
	left: number
	movementX: number
	movementY: number
	width: number
	height: number
}

const defaultState: State = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	movementX: 0,
	movementY: 0,
	width: 100,
	height: 100
}

const state = proxy<State>(structuredClone(defaultState))

interface ViewBoxPhotoEditorProps {
	photoUrl: string
	onViewBoxCopied?: () => void
}

export function ViewBoxPhotoEditor({
	photoUrl,
	onViewBoxCopied
}: ViewBoxPhotoEditorProps): ReactNode {
	const { top, right, bottom, left } = useSnapshot(state)

	const minSides = useMemo<number[]>(() => {
		let sides: number[] = [top, right, bottom, left]
		if (sides[1] === sides[3]) {
			sides.pop()
			if (sides[0] === sides[2]) {
				sides.pop()
				if (sides[0] === sides[1]) {
					sides.pop()
				}
			}
		}
		return sides
	}, [top, right, bottom, left])

	const objectViewBox = useMemo<string>(() => {
		const minViewBox: string = minSides.map((pos) => `${pos}%`).join(' ')
		return `inset(${minViewBox})`
	}, [minSides])

	const scale = (delta: -1 | 1): void => {
		if ((top + bottom) % 2 === 0) {
			state.top += delta
		} else {
			state.bottom += delta
		}
		if ((right + left) % 2 === 0) {
			state.left += delta
		} else {
			state.right += delta
		}
	}

	const handleFrameWheel = (event: WheelEvent): void => {
		const delta: -1 | 1 = event.deltaY > 0 ? -1 : 1
		scale(delta)
	}

	const handleFramePointerMove = (event: PointerEvent): void => {
		if (event.buttons !== 1) return
		event.currentTarget.setPointerCapture(event.pointerId)
		state.movementX += event.movementX
		state.movementY += event.movementY
		if (Math.abs(state.movementX) >= 5) {
			const amount: number = state.movementX < 0 ? -1 : 1
			state.left -= amount
			state.right += amount
			state.movementX = 0
		}
		if (Math.abs(state.movementY) >= 5) {
			const amount: number = state.movementY < 0 ? -1 : 1
			state.top -= amount
			state.bottom += amount
			state.movementY = 0
		}
	}

	const handleFrameLostPointerCapture = (event: PointerEvent): void => {
		event.currentTarget.releasePointerCapture(event.pointerId)
		state.movementX = 0
		state.movementY = 0
	}

	const handleBottomPointerMove = (event: PointerEvent): void => {
		if (event.buttons !== 1) return
		event.currentTarget.setPointerCapture(event.pointerId)
		state.movementY += event.movementY
		if (Math.abs(state.movementY) >= 2) {
			const amount: number = state.movementY < 0 ? -1 : 1
			if ((top + bottom) % 2 === 0) {
				state.top -= amount
			} else {
				state.bottom -= amount
			}
			state.movementY = 0
		}
	}

	const handleBottomLostPointerCapture = (event: PointerEvent): void => {
		event.currentTarget.releasePointerCapture(event.pointerId)
		state.movementY = 0
	}

	const handleCopyViewBox = async (): Promise<void> => {
		await copyText(`#${minSides}`)
		await wait(100)
		onViewBoxCopied?.()
	}

	// useEffect(() => {
	// 	if (top + bottom < 0) {
	// 		state.top = 0
	// 		state.bottom = 0
	// 	} else if (top < 0) {
	// 		state.top++
	// 		state.bottom--
	// 	} else if (bottom < 0) {
	// 		state.top--
	// 		state.bottom++
	// 	}
	// }, [top, bottom])

	// useEffect(() => {
	// 	if (left + right < 0) {
	// 		state.left = 0
	// 		state.right = 0
	// 	} else if (left < 0) {
	// 		state.left++
	// 		state.right--
	// 	} else if (right < 0) {
	// 		state.left--
	// 		state.right++
	// 	}
	// }, [left, right])

	useEffect(() => {
		Object.assign(state, structuredClone(defaultState))
	}, [photoUrl])

	return (
		<div className="flex flex-col items-center gap-4 pt-16 select-none">
			<div className="relative">
				<div
					className="max-h-64 w-80 overflow-hidden rounded-md bg-rose-500"
					onWheel={handleFrameWheel}
					onPointerMove={handleFramePointerMove}
					onLostPointerCapture={handleFrameLostPointerCapture}
				>
					<img
						className="drag-none rendering-contrast size-full"
						src={photoUrl}
						style={{
							objectViewBox
						}}
					/>
				</div>

				<div
					className="absolute bottom-0 h-4 w-full cursor-ns-resize rounded-b hover:bg-blue-500/50"
					onPointerMove={handleBottomPointerMove}
					onLostPointerCapture={handleBottomLostPointerCapture}
				/>
			</div>

			<div
				className="flex cursor-copy gap-2 rounded px-2 hover:bg-blue-500/50 active:scale-95"
				onClick={handleCopyViewBox}
			>
				{minSides.map((side) => (
					<div>{side}</div>
				))}
			</div>
		</div>
	)
}
