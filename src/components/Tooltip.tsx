import { ReactElement, ReactNode } from 'react'
import { Popper } from './Popper'
import { Placement } from '@floating-ui/react'

type Props = {
	placement?: Placement
	distance?: number
	content: ReactNode
	children: ReactElement
}

export function Tooltip({ placement, distance = 3, content, children }: Props): ReactNode {
	return (
		<Popper
			placement={placement}
			distance={distance}
			padding={4}
			hoverDelay={20}
			arrowClassName="fill-zinc-100"
			content={() => (
				<div className="px-2 py-0.5 rounded bg-zinc-100 text-black shadow shadow-zinc-950 pointer-events-none">
					{content}
				</div>
			)}
		>
			{children}
		</Popper>
	)
}
