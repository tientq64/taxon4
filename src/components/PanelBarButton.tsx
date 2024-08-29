import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { Panel } from '../models/panels'
import { Tooltip } from './Tooltip'

type Props = {
	panel: Panel
}

export function PanelBarButton({ panel }: Props): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { currentPanel, setCurrentPanel } = store

	const handleClick = (): void => {
		setCurrentPanel(panel)
	}

	return (
		<Tooltip placement="right" content={panel.text}>
			<button
				key={panel.name}
				className={`
						flex justify-center items-center p-2 size-12
						${
							currentPanel.name === panel.name
								? 'text-white pointer-events-none'
								: 'text-zinc-500 hover:text-zinc-400'
						}
					`}
				onClick={handleClick}
			>
				<span className="text-3xl material-symbols-rounded">{panel.icon}</span>
			</button>
		</Tooltip>
	)
}
