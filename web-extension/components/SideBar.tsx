import { ReactNode, useEffect } from 'react'
import { useStore } from '../store/useStore'

export function SideBar(): ReactNode {
	const sites = useStore((state) => state.sites)
	const hasSubspecies = useStore((state) => state.hasSubspecies)
	const setHasSubspecies = useStore((state) => state.setHasSubspecies)

	useEffect(() => {
		if (!sites.wikipedia) return
		const html: string = document.body.innerHTML
		const foundSubspecies: boolean = /\bsub-?species\b/i.test(html)
		setHasSubspecies(foundSubspecies)
	}, [setHasSubspecies, sites.wikipedia])

	return (
		<div className="w-60 mt-16">
			{sites.wikipedia && (
				<div>
					{hasSubspecies && <div className="text-blue-800">Có phân loài</div>}
					{!hasSubspecies && <div className="text-rose-800">Không có phân loài</div>}
				</div>
			)}
		</div>
	)
}
