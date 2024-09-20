import { find } from 'lodash-es'
import { createElement, ReactNode, useMemo } from 'react'
import { Panel, panels } from '../models/panels'
import { useStore } from '../store/useStore'
import { PanelBarButton } from './PanelBarButton'
import logoImage from '/assets/images/logo.png'

export function PanelsSide(): ReactNode {
	const currentPanelName = useStore((state) => state.currentPanelName)

	const currentPanel = useMemo<Panel | undefined>(() => {
		return find(panels, { name: currentPanelName })
	}, [currentPanelName])

	return (
		<div className="flex">
			<div className="flex flex-col bg-zinc-950">
				<div className="flex justify-center items-center p-2 size-12 my-1">
					<img src={logoImage} alt="Logo" />
				</div>

				{panels.map((panel) => (
					<PanelBarButton key={panel.name} panel={panel} />
				))}
			</div>

			<div className="flex-1 flex flex-col w-[17rem]">
				{currentPanel && (
					<>
						<div className="px-3 pt-2 pb-1 uppercase">{currentPanel.text}</div>
						<div className="flex-1 overflow-hidden">
							{createElement(currentPanel.component)}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
