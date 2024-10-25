import clsx from 'clsx'
import { ReactNode, useCallback, useMemo } from 'react'
import { Panel } from '../models/panels'
import { useStore } from '../store/useStore'
import { Tooltip } from './Tooltip'

type Props = {
	panel: Panel
}

export function PanelBarButton({ panel }: Props): ReactNode {
	const currentPanelName = useStore((state) => state.currentPanelName)
	const setCurrentPanelName = useStore((state) => state.setCurrentPanelName)

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
					'flex justify-center items-center p-2 size-12 select-none',
					selected ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
				)}
				type="button"
				aria-selected={selected}
				onClick={handleClick}
			>
				<span className="text-3xl material-symbols-rounded">{panel.icon}</span>
			</button>
		</Tooltip>
	)
}
