import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { panels } from '../models/panels'
import { PanelBarButton } from './PanelBarButton'
import logoImage from '/assets/images/logo.png'

export function PanelBar(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	return (
		<div className="flex flex-col bg-zinc-950">
			<button className="flex justify-center items-center p-2 size-12 my-1">
				<img className="p-px rounded-full bg-zinc-300" src={logoImage} alt="Logo" />
			</button>

			{panels.map((panel) => (
				<PanelBarButton panel={panel} />
			))}
		</div>
	)
}
