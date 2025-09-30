import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel } from '../constants/panels'
import { app, useApp } from '../store/app'
import { Icon } from './Icon'
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

	const tooltipContent: ReactNode = (
		<div className="flex max-w-80 flex-col gap-1 p-1">
			{t(`${panel.name}.title`)}
			<div className="mt-1 border-t border-zinc-500 pt-1 text-justify leading-4.5 text-zinc-300 empty:hidden">
				{t(`${panel.name}.description`, '')}
			</div>
		</div>
	)

	return (
		<Tooltip placement="right" beforeContent={tooltipContent}>
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
				<Icon className="text-3xl" name={panel.icon} />
				{selected && <div className="absolute left-0 h-2/3 w-[3px] rounded bg-blue-500" />}
			</button>
		</Tooltip>
	)
}
