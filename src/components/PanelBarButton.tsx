import clsx from 'clsx'
import { ReactNode } from 'react'
import { Panel } from '../constants/panels'
import { useAppStore } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

interface PanelBarButtonProps {
	panel: Panel
}

export function PanelBarButton({ panel }: PanelBarButtonProps): ReactNode {
	const currentPanelName = useAppStore((state) => state.currentPanelName)
	const setCurrentPanelName = useAppStore((state) => state.setCurrentPanelName)

	const selected: boolean = panel.name === currentPanelName

	const handleChangePanelName = (): void => {
		if (selected) return
		setCurrentPanelName(panel.name)
	}

	return (
		<Tooltip placement="right" content={panel.text}>
			<button
				role="tab"
				key={panel.name}
				className={clsx(
					'flex size-12 cursor-pointer items-center justify-center p-2 select-none',
					selected ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
				)}
				type="button"
				aria-selected={selected}
				onClick={handleChangePanelName}
			>
				<span className="material-symbols-rounded text-3xl">{panel.icon}</span>
			</button>
		</Tooltip>
	)
}
