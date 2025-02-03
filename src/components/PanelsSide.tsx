import clsx from 'clsx'
import { find } from 'lodash-es'
import { createElement, ReactNode, useMemo } from 'react'
import { Panel, panels } from '../constants/panels'
import { useAppStore } from '../store/useAppStore'
import { PanelBarButton } from './PanelBarButton'
import logoImage from '/assets/images/logo.png'

export function PanelsSide(): ReactNode {
	const currentPanelName = useAppStore((state) => state.currentPanelName)
	const indentGuideShown = useAppStore((state) => state.indentGuideShown)

	const currentPanel = useMemo<Panel | undefined>(() => {
		return find(panels, { name: currentPanelName })
	}, [currentPanelName])

	return (
		<aside className={clsx('flex', !indentGuideShown && 'outline outline-1 outline-zinc-700')}>
			<nav role="tablist" className="flex flex-col bg-zinc-950">
				<div className="my-1 flex size-12 items-center justify-center p-2">
					<img src={logoImage} alt="Logo" />
				</div>

				{panels.map((panel) => (
					<PanelBarButton key={panel.name} panel={panel} />
				))}
			</nav>

			<div role="tabpanel" className="flex w-[17rem] flex-1 flex-col">
				{currentPanel && (
					<>
						<div className="px-3 pb-1 pt-2 uppercase">{currentPanel.text}</div>
						<div className="flex-1 overflow-hidden">
							{createElement(currentPanel.component)}
						</div>
					</>
				)}
			</div>
		</aside>
	)
}
