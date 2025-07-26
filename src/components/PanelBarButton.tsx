import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel } from '../constants/panels'
import { app, useApp } from '../store/useAppStore'
import { Tooltip } from './Tooltip'

interface PanelBarButtonProps {
	panel: Panel
}

export function PanelBarButton({ panel }: PanelBarButtonProps): ReactNode {
	const { activePanelName } = useApp()

	const { t } = useTranslation()

	const selected: boolean = panel.name === activePanelName

	const handleChangePanelName = (): void => {
		if (selected) return
		app.activePanelName = panel.name
	}

	return (
		<Tooltip placement="right" content={t(`panels.${panel.name}`)}>
			<button
				role="tab"
				key={panel.name}
				className={clsx(
					'relative flex size-12 cursor-pointer items-center justify-center p-2 select-none',
					!selected && 'text-zinc-500 hover:text-zinc-400 active:scale-90',
					selected && 'text-white'
				)}
				type="button"
				aria-selected={selected}
				onClick={handleChangePanelName}
			>
				<span className="material-symbols-rounded text-3xl">{panel.icon}</span>

				{selected && <div className="absolute left-0 h-2/3 w-[3px] rounded bg-blue-500" />}
			</button>
		</Tooltip>
	)
}
