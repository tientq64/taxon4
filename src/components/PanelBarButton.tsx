import clsx from 'clsx'
import { ReactNode, useCallback, useMemo } from 'react'
import { Panel } from '../models/panels'
import { useAppStore } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

interface PanelBarButtonProps {
	panel: Panel
}

export function PanelBarButton({ panel }: PanelBarButtonProps): ReactNode {
	const currentPanelName = useAppStore((state) => state.currentPanelName)
	const setCurrentPanelName = useAppStore((state) => state.setCurrentPanelName)

	const selected: boolean = useMemo(() => {
		return currentPanelName === panel.name
	}, [currentPanelName, panel.name])

	const handleClick = useCallback((): void => {
		if (selected) return
		setCurrentPanelName(panel.name)
	}, [panel.name, selected, setCurrentPanelName])

	return (
		<Tooltip placement="right" content={panel.text}>
			<button
				role="tab"
				key={panel.name}
				className={clsx(
					'flex size-12 select-none items-center justify-center p-2',
					selected ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
				)}
				type="button"
				aria-selected={selected}
				onClick={handleClick}
			>
				<span className="material-symbols-rounded text-3xl">{panel.icon}</span>
			</button>
		</Tooltip>
	)
}
