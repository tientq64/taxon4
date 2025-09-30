import clsx from 'clsx'
import { createElement, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel, panels } from '../constants/panels'
import { useApp } from '../store/app'
import { PanelBarButton } from './PanelBarButton'
import logoImage from '/assets/images/logo.png'

export function PanelsSide(): ReactNode {
	const { activePanelName, indentGuideVisible } = useApp()

	const { t } = useTranslation()

	const currentPanel = useMemo<Panel | undefined>(() => {
		return panels.find((panel) => panel.name === activePanelName)
	}, [activePanelName])

	return (
		<aside className={clsx('flex', !indentGuideVisible && 'outline outline-zinc-700')}>
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
						<div className="px-3 pt-2 pb-1 uppercase">
							{t(`${currentPanel.name}.title`)}
						</div>
						<div className="flex-1 overflow-hidden">
							{createElement(currentPanel.component)}
						</div>
					</>
				)}
			</div>
		</aside>
	)
}
