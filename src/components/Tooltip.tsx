import { Placement } from '@floating-ui/react'
import { ReactElement, ReactNode } from 'react'
import { Popper } from './Popper'

interface Props {
	placement?: Placement
	distance?: number
	content: ReactNode | (() => ReactNode)
	children: ReactElement
}

export function Tooltip({ placement, distance = 3, content, children }: Props): ReactNode {
	return (
		<Popper
			popperClassName="pointer-events-none z-40"
			placement={placement}
			distance={distance}
			padding={4}
			hoverDelay={20}
			arrowClassName="fill-zinc-700"
			content={() => (
				<div className="pointer-events-none rounded-md bg-zinc-700 px-2 py-0.5 text-zinc-100 shadow shadow-zinc-950">
					{typeof content === 'function' ? content() : content}
				</div>
			)}
		>
			{children}
		</Popper>
	)
}
