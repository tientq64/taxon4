import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { AboutPanel } from './AboutPanel'
import { RanksPanel } from './RanksPanel'
import { SearchPanel } from './SearchPanel'
import { SettingsPanel } from './SettingsPanel'

export function Panels(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { currentPanel } = store

	return (
		<div className="flex-1 flex flex-col gap-2 w-[17rem] py-2 px-3">
			<div className="uppercase">{currentPanel.text}</div>

			<div className="flex-1 overflow-hidden">
				{currentPanel.name === 'ranks' && <RanksPanel />}
				{currentPanel.name === 'search' && <SearchPanel />}
				{currentPanel.name === 'stats' && 'Chưa làm'}
				{currentPanel.name === 'settings' && <SettingsPanel />}
				{currentPanel.name === 'about' && <AboutPanel />}
			</div>
		</div>
	)
}
