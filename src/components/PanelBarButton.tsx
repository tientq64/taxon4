import clsx from 'clsx'
import { ReactNode } from 'react'
import { Panel } from '../models/panels'
import { useStore } from '../store/useStore'
import { Tooltip } from './Tooltip'

type Props = {
	panel: Panel
}

export function PanelBarButton({ panel }: Props): ReactNode {
	const currentPanelName = useStore((state) => state.currentPanelName)
	const setCurrentPanelName = useStore((state) => state.setCurrentPanelName)

	const handleClick = (): void => {
		setCurrentPanelName(panel.name)
	}

	return (
		<Tooltip placement="right" content={panel.text}>
			<button
				key={panel.name}
				className={clsx(
					'flex justify-center items-center p-2 size-12',
					currentPanelName === panel.name
						? 'text-white pointer-events-none'
						: 'text-zinc-500 hover:text-zinc-400'
				)}
				onClick={handleClick}
			>
				<span className="text-3xl material-symbols-rounded">{panel.icon}</span>
			</button>
		</Tooltip>
	)
}
