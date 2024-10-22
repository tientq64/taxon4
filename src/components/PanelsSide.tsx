import clsx from 'clsx'
import { find } from 'lodash-es'
import { createElement, ReactNode, useMemo } from 'react'
import { Panel, panels } from '../models/panels'
import { useStore } from '../store/useStore'
import { PanelBarButton } from './PanelBarButton'
import logoImage from '/assets/images/logo.png'

export function PanelsSide(): ReactNode {
	const currentPanelName = useStore((state) => state.currentPanelName)
	const indentGuideShown = useStore((state) => state.indentGuideShown)

	const currentPanel = useMemo<Panel | undefined>(() => {
		return find(panels, { name: currentPanelName })
	}, [currentPanelName])

	return (
		<aside className={clsx('flex', !indentGuideShown && 'outline outline-1 outline-zinc-700')}>
			<nav role="tablist" className="flex flex-col bg-zinc-950">
				<div className="flex justify-center items-center p-2 size-12 my-1">
					<img src={logoImage} alt="Logo" />
				</div>

				{panels.map((panel) => (
					<PanelBarButton key={panel.name} panel={panel} />
				))}
			</nav>

			<div role="tabpanel" className="flex-1 flex flex-col w-[17rem]">
				{currentPanel && (
					<>
						<div className="px-3 pt-2 pb-1 uppercase">{currentPanel.text}</div>
						<div className="flex-1 overflow-hidden">
							{createElement(currentPanel.component)}
						</div>
					</>
				)}
			</div>
		</aside>
	)
}
