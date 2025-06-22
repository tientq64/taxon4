import { useRequest } from 'ahooks'
import { ReactNode, useEffect } from 'react'
import { getWikipediaSummary } from '../../src/api/getWikipediaSummary'
import { ext, useExt } from '../store/ext'

export function SideBar(): ReactNode {
	const { sites, hasSubspecies } = useExt()

	const getWikiSummaryApi = useRequest(getWikipediaSummary, { manual: true })

	useEffect(() => {
		if (!sites.wikipedia) return
		const html: string = document.body.innerHTML
		ext.hasSubspecies = /\bsub-?species\b/i.test(html)
	}, [sites.wikipedia])

	useEffect(() => {
		const isNotEnLangPage: boolean = !location.hostname.startsWith('en.')
		if (isNotEnLangPage) return
		const viLangLink = document.querySelector<HTMLAnchorElement>(
			'.interlanguage-link.interwiki-vi > a, .interlanguage-link.interwiki-en > a'
		)
		if (viLangLink === null) return
		const query: string | undefined = viLangLink.href.split('/').at(-1)
		if (query === undefined) return
		getWikiSummaryApi.run(query, 'vi', true)
	}, [])

	return (
		<div className="mt-16 w-72">
			{sites.wikipedia && (
				<div className="pointer-events-auto flex flex-col gap-4">
					<div>
						{getWikiSummaryApi.loading && (
							<div className="text-center text-gray-400">Đang tải...</div>
						)}
						{!getWikiSummaryApi.loading && (
							<>
								{getWikiSummaryApi.data == null && (
									<div className="text-center text-gray-400">
										Không có dữ liệu
									</div>
								)}
								{getWikiSummaryApi.data != null && (
									<div
										className="text-justify"
										dangerouslySetInnerHTML={{ __html: getWikiSummaryApi.data }}
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
