import { ReactElement, ReactNode } from 'react'
import { Popper } from './Popper'
import { Placement } from '@floating-ui/react'

type Props = {
	placement?: Placement
	distance?: number
	content: string
	children: ReactElement
}

export function Tooltip({ placement, distance = 3, content, children }: Props): ReactNode {
	return (
		<Popper
			placement={placement}
			distance={distance}
			hoverDelay={20}
			arrowClassName="fill-zinc-100"
			content={() => (
				<div className="px-2 rounded bg-zinc-100 text-black shadow shadow-zinc-950 pointer-events-none">
					{content}
				</div>
			)}
		>
			{children}
		</Popper>
	)
}
