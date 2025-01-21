import { ReactNode, useEffect } from 'react'
import { useExtStore } from '../store/useExtStore'
import { useGetWikipediaSummary } from '../../src/hooks/useGetWikipediaSummary'

export function SideBar(): ReactNode {
	const sites = useExtStore((state) => state.sites)
	const hasSubspecies = useExtStore((state) => state.hasSubspecies)
	const setHasSubspecies = useExtStore((state) => state.setHasSubspecies)

	const { run, loading, data } = useGetWikipediaSummary()

	useEffect(() => {
		if (!sites.wikipedia) return
		const html: string = document.body.innerHTML
		const foundSubspecies: boolean = /\bsub-?species\b/i.test(html)
		setHasSubspecies(foundSubspecies)
	}, [setHasSubspecies, sites.wikipedia])

	useEffect(() => {
		const isNotEnLangPage: boolean = !location.hostname.startsWith('en.')
		if (isNotEnLangPage) return
		const viLangLink = document.querySelector<HTMLAnchorElement>(
			'.interlanguage-link.interwiki-vi > a, .interlanguage-link.interwiki-en > a'
		)
		if (viLangLink === null) return
		const query: string | undefined = viLangLink.href.split('/').at(-1)
		if (query === undefined) return
		run(query, 'vi', true)
	}, [])

	return (
		<div className="mt-16 w-72">
			{sites.wikipedia && (
				<div className="pointer-events-auto flex flex-col gap-4">
					<div>
						{loading && <div className="text-center text-gray-400">Đang tải...</div>}
						{!loading && (
							<>
								{data == null && (
									<div className="text-center text-gray-400">
										Không có dữ liệu
									</div>
								)}
								{data != null && (
									<div
										className="text-justify"
										dangerouslySetInnerHTML={{ __html: data }}
									/>
								)}
							</>
						)}
					</div>

					<div className="text-center">
						{hasSubspecies && <div className="text-blue-400">Có phân loài</div>}
						{!hasSubspecies && <div className="text-rose-400">Không có phân loài</div>}
					</div>
				</div>
			)}
		</div>
	)
}
